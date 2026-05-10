/**
 * generate-component-spec.ts
 *
 * Walks packages/ui/src/components, extracts prop types for every component
 * that is publicly exported from packages/ui/src/index.ts, and writes a
 * structured JSON spec to packages/ui/components.spec.json.
 *
 * The spec feeds:
 *   - scripts/generate-llms-full.ts (AI context file)
 *   - future Figma Code Connect / Figma Variables sync tooling
 *
 * Uses the TypeScript compiler API directly so we don't add a new dep
 * (`typescript` is already present as a devDep).
 */

import ts from 'typescript'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageRoot = path.resolve(__dirname, '..')
const componentsDir = path.join(packageRoot, 'src/components')
const storybookStoriesDir = path.resolve(packageRoot, '../../services/storybook/stories/UI')
const outputPath = path.join(packageRoot, 'components.spec.json')

type PropInfo = {
  name: string
  type: string
  optional: boolean
  description?: string
}

type PropTypeInfo = {
  name: string
  props: PropInfo[]
  extendsDom?: string
  exported: boolean
  /** Source file relative to component dir, e.g. "types.ts" or "Root.tsx" */
  source: string
}

type ComponentSpec = {
  name: string
  path: string
  valueExports: string[]
  typeExports: string[]
  hookExports: string[]
  propTypes: PropTypeInfo[]
  compoundParts: string[]
  hasTest: boolean
  hasStory: boolean
  storyPath?: string
}

function parseSourceFile(filePath: string): ts.SourceFile | null {
  if (!fs.existsSync(filePath)) return null
  const source = fs.readFileSync(filePath, 'utf-8')
  return ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}

/**
 * Parse packages/ui/src/index.ts.
 * Returns a map: componentFolderName → { values, types, hooks }.
 *   Button:   { values: ['Button'], types: ['ButtonProps'], hooks: [] }
 *   Selector: { values: ['TagSelector','BadgeSelector','BasicSelector'],
 *               types: [...], hooks: ['useTagSelectorContext', ...] }
 */
function parseBarrelExports(indexPath: string) {
  const sf = parseSourceFile(indexPath)
  if (!sf) throw new Error(`Cannot read ${indexPath}`)

  const byFolder = new Map<string, { values: string[]; types: string[]; hooks: string[] }>()

  sf.forEachChild((node) => {
    if (!ts.isExportDeclaration(node)) return
    if (!node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) return

    const modulePath = node.moduleSpecifier.text
    const match = modulePath.match(/\.\/components\/([^/]+)/)
    if (!match) return
    const folder = match[1]

    if (!byFolder.has(folder)) {
      byFolder.set(folder, { values: [], types: [], hooks: [] })
    }
    const bucket = byFolder.get(folder)!

    const isTypeOnly = node.isTypeOnly
    const clause = node.exportClause
    if (!clause || !ts.isNamedExports(clause)) return

    for (const el of clause.elements) {
      const name = el.name.text
      if (isTypeOnly) {
        bucket.types.push(name)
      } else if (/^use[A-Z]/.test(name)) {
        bucket.hooks.push(name)
      } else {
        bucket.values.push(name)
      }
    }
  })

  return byFolder
}

/**
 * Extract property signatures from a TypeLiteralNode (the `{ ... }` shape part of a type).
 */
function extractPropsFromTypeLiteral(node: ts.TypeLiteralNode, acc: PropInfo[]) {
  for (const member of node.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue
    const name = member.name.getText()
    const type = member.type ? member.type.getText().replace(/\s+/g, ' ').trim() : 'unknown'
    const optional = !!member.questionToken
    const jsDoc = getJsDocComment(member)
    acc.push({ name, type, optional, description: jsDoc })
  }
}

function getJsDocComment(node: ts.Node): string | undefined {
  const jsDocs = (node as unknown as { jsDoc?: ts.JSDoc[] }).jsDoc
  if (!jsDocs || jsDocs.length === 0) return undefined
  const text = jsDocs
    .map((j) => (typeof j.comment === 'string' ? j.comment : ''))
    .filter(Boolean)
    .join(' ')
    .trim()
  return text || undefined
}

/**
 * From a source file, find every `type <Name>Props = ...` declaration (exported
 * or not — compound parts often keep them local) and flatten fields.
 */
function extractPropTypesFromSourceFile(sf: ts.SourceFile, sourceLabel: string): PropTypeInfo[] {
  const result: PropTypeInfo[] = []

  sf.forEachChild((node) => {
    if (!ts.isTypeAliasDeclaration(node)) return
    const name = node.name.text
    if (!name.endsWith('Props')) return
    const exported = !!node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)

    const props: PropInfo[] = []
    let extendsDom: string | undefined

    const walk = (t: ts.TypeNode) => {
      if (ts.isTypeLiteralNode(t)) {
        extractPropsFromTypeLiteral(t, props)
      } else if (ts.isIntersectionTypeNode(t)) {
        for (const m of t.types) walk(m)
      } else if (ts.isTypeReferenceNode(t)) {
        const refText = t.getText()
        if (/HTMLAttributes|HTMLProps|AriaAttributes/.test(refText)) {
          extendsDom = refText
        }
      }
    }

    walk(node.type)
    result.push({ name, props, extendsDom, exported, source: sourceLabel })
  })

  return result
}

/**
 * Return names that look like React components — either `.tsx` files whose
 * basename starts with an uppercase letter, or sub-directories with a
 * capitalized name. Used both as the source list for prop-type extraction and
 * as the human-facing `compoundParts` list in the JSON spec.
 */
function listCompoundParts(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const names = new Set<string>()
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && e.name.endsWith('.tsx') && !e.name.endsWith('.test.tsx')) {
      const base = e.name.replace(/\.tsx$/, '')
      if (/^[A-Z]/.test(base)) names.add(base)
    } else if (e.isDirectory() && /^[A-Z]/.test(e.name)) {
      names.add(e.name)
    }
  }
  return [...names].sort()
}

/**
 * Given a folder from the barrel (e.g. "Button" or "Selector"), resolve every
 * ComponentSpec for the value exports rooted in that folder.
 */
function buildSpecsForFolder(
  folderName: string,
  bucket: { values: string[]; types: string[]; hooks: string[] }
): ComponentSpec[] {
  const folderDir = path.join(componentsDir, folderName)
  if (!fs.existsSync(folderDir)) return []

  // Case 1: single component folder (Button, Badge, ...)
  const flatTsx = path.join(folderDir, `${folderName}.tsx`)
  const flatTypes = path.join(folderDir, 'types.ts')
  if (fs.existsSync(flatTsx) || fs.existsSync(flatTypes)) {
    return [buildSpecForComponent(folderName, folderDir, bucket)]
  }

  // Case 2: grouped folder (Selector, Toast, ...).
  // Each value export maps to a sub-folder with the same name.
  const specs: ComponentSpec[] = []
  for (const valueName of bucket.values) {
    const subDir = path.join(folderDir, valueName)
    if (!fs.existsSync(subDir)) continue

    const subBucket = {
      values: [valueName],
      types: bucket.types.filter((t) => t.startsWith(valueName)),
      hooks: bucket.hooks.filter((h) => h.includes(valueName))
    }
    specs.push(buildSpecForComponent(valueName, subDir, subBucket))
  }
  return specs
}

function buildSpecForComponent(
  name: string,
  dir: string,
  bucket: { values: string[]; types: string[]; hooks: string[] }
): ComponentSpec {
  const propTypes: PropTypeInfo[] = []
  const seen = new Set<string>()

  const addFromFile = (filePath: string) => {
    if (!fs.existsSync(filePath)) return
    const sf = parseSourceFile(filePath)
    if (!sf) return
    const sourceLabel = path.basename(filePath)
    for (const p of extractPropTypesFromSourceFile(sf, sourceLabel)) {
      if (seen.has(p.name)) continue
      seen.add(p.name)
      propTypes.push(p)
    }
  }

  // Priority order: types.ts first, then main <Name>.tsx, then sibling .tsx
  // parts (Root, Content, etc. for compound components).
  addFromFile(path.join(dir, 'types.ts'))
  addFromFile(path.join(dir, `${name}.tsx`))

  const allTsxParts = listCompoundParts(dir)
  for (const part of allTsxParts) {
    if (part === name) continue
    addFromFile(path.join(dir, `${part}.tsx`))
  }

  const compoundParts = allTsxParts.filter((p) => p !== name && p !== `${name}.test`)
  const hasTest = fs.existsSync(path.join(dir, `${name}.test.tsx`))

  const storyDir = path.join(storybookStoriesDir, name)
  const hasStory = fs.existsSync(storyDir)
  const storyPath = hasStory ? path.relative(packageRoot, storyDir) : undefined

  return {
    name,
    path: path.relative(packageRoot, dir),
    valueExports: bucket.values,
    typeExports: bucket.types,
    hookExports: bucket.hooks,
    propTypes,
    compoundParts,
    hasTest,
    hasStory,
    storyPath
  }
}

function main() {
  const indexPath = path.join(packageRoot, 'src/index.ts')
  const byFolder = parseBarrelExports(indexPath)

  const components: ComponentSpec[] = []
  for (const [folder, bucket] of byFolder) {
    components.push(...buildSpecsForFolder(folder, bucket))
  }
  components.sort((a, b) => a.name.localeCompare(b.name))

  const output = {
    generatedAt: new Date().toISOString(),
    componentCount: components.length,
    components
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n')
  console.log(`✅ ${components.length} components → ${path.relative(process.cwd(), outputPath)}`)
}

main()
