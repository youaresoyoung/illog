/**
 * generate-llms-full.ts
 *
 * Reads:
 *   - packages/ui/components.spec.json   (run gen:spec first)
 *   - packages/themes/src/tokens/        (size, typography, radius, etc.)
 *   - packages/themes/dist/themes.css    (generated color CSS variables; optional)
 *
 * Writes:
 *   - services/web/public/llms-full.txt
 *
 * The output is a single Markdown file optimized for AI consumption. It is
 * what an agent should read before generating any UI for illog.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(packageRoot, '../..')
const themesRoot = path.join(repoRoot, 'packages/themes')
const specPath = path.join(packageRoot, 'components.spec.json')
const outputPath = path.join(repoRoot, 'services/web/public/llms-full.txt')

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

type Spec = {
  generatedAt: string
  componentCount: number
  components: ComponentSpec[]
}

function readSpec(): Spec {
  if (!fs.existsSync(specPath)) {
    throw new Error(`${specPath} not found. Run \`pnpm --filter @illog/ui gen:spec\` first.`)
  }
  return JSON.parse(fs.readFileSync(specPath, 'utf-8'))
}

/**
 * Extract `export const <name> = { ... }` object-literal tokens from a TS source file
 * using a small regex. Tokens in this repo are simple flat objects of primitives so
 * we don't need a full parser.
 */
function extractObjectExports(filePath: string): Record<string, Record<string, string | number>> {
  if (!fs.existsSync(filePath)) return {}
  const src = fs.readFileSync(filePath, 'utf-8')
  const result: Record<string, Record<string, string | number>> = {}

  const re = /export const (\w+)\s*=\s*\{([\s\S]*?)\n\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    const name = m[1]
    const body = m[2]
    const obj: Record<string, string | number> = {}
    const lineRe = /['"]?([\w-]+)['"]?\s*:\s*([^,\n}]+)[,\n]/g
    let lm: RegExpExecArray | null
    while ((lm = lineRe.exec(body + '\n')) !== null) {
      const key = lm[1]
      let val: string | number = lm[2].trim().replace(/['"]/g, '')
      const num = Number(val)
      if (!Number.isNaN(num) && val !== '') val = num
      obj[key] = val
    }
    result[name] = obj
  }
  return result
}

function readTokens() {
  const tokenDir = path.join(themesRoot, 'src/tokens')
  return {
    space: extractObjectExports(path.join(tokenDir, 'size/space.ts')).space ?? {},
    radius: extractObjectExports(path.join(tokenDir, 'size/radius.ts')).radius ?? {},
    icon: extractObjectExports(path.join(tokenDir, 'size/icon.ts')).icon ?? {},
    blur: extractObjectExports(path.join(tokenDir, 'size/blur.ts')).blur ?? {},
    depth: extractObjectExports(path.join(tokenDir, 'size/depth.ts')).depth ?? {},
    stroke: extractObjectExports(path.join(tokenDir, 'size/stroke.ts')).stroke ?? {},
    typography: extractObjectExports(path.join(tokenDir, 'typography/typography.ts')),
    typographyPrimitive: extractObjectExports(path.join(tokenDir, 'typography/primitive.ts')),
    responsive: extractObjectExports(path.join(tokenDir, 'responsive.ts'))
  }
}

function readColorVarNames(): string[] {
  const cssPath = path.join(themesRoot, 'dist/themes.css')
  if (!fs.existsSync(cssPath)) return []
  const css = fs.readFileSync(cssPath, 'utf-8')
  const root = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? ''
  const names = new Set<string>()
  const re = /--([a-z0-9-]+)\s*:/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(root)) !== null) names.add(m[1])
  return [...names].sort()
}

/* ---------- Markdown rendering ---------- */

function renderTokenTable(name: string, obj: Record<string, string | number>): string {
  const rows = Object.entries(obj)
    .map(([k, v]) => `| \`${k}\` | \`${v}\` |`)
    .join('\n')
  return `### ${name}\n\n| key | value |\n|---|---|\n${rows}\n`
}

function renderColorVars(names: string[]): string {
  if (names.length === 0) {
    return `_Color CSS variables are generated at build time. Run \`pnpm --filter @illog/themes build:css\` then re-run this script to populate this section._\n`
  }
  const grouped: Record<string, string[]> = {}
  for (const n of names) {
    const prefix = n.split('-')[0]
    grouped[prefix] ??= []
    grouped[prefix].push(`var(--${n})`)
  }
  return Object.entries(grouped)
    .map(
      ([prefix, vars]) =>
        `**${prefix}** (${vars.length})\n\n${vars.map((v) => `- \`${v}\``).join('\n')}`
    )
    .join('\n\n')
}

function renderPropsTable(propType: PropTypeInfo): string {
  if (propType.props.length === 0) return '_(no individual fields)_\n'
  const rows = propType.props
    .map((p) => {
      const req = p.optional ? '–' : '✓'
      const desc = p.description ? p.description.replace(/\|/g, '\\|') : ''
      const type = p.type.replace(/\|/g, '\\|')
      return `| \`${p.name}\` | \`${type}\` | ${req} | ${desc} |`
    })
    .join('\n')
  return `| prop | type | required | description |\n|---|---|---|---|\n${rows}\n`
}

function renderComponent(c: ComponentSpec): string {
  const lines: string[] = []
  lines.push(`### \`${c.name}\``)
  lines.push('')
  lines.push(`- **Folder**: \`${c.path}\``)
  lines.push(`- **Import**: \`import { ${c.valueExports.join(', ')} } from '@illog/ui'\``)
  if (c.typeExports.length > 0) {
    lines.push(`- **Types**: \`import type { ${c.typeExports.join(', ')} } from '@illog/ui'\``)
  }
  if (c.hookExports.length > 0) {
    lines.push(`- **Hooks**: ${c.hookExports.map((h) => `\`${h}\``).join(', ')}`)
  }
  if (c.compoundParts.length > 0) {
    lines.push(
      `- **Compound parts** (sub-components inside the folder): ${c.compoundParts
        .map((p) => `\`${p}\``)
        .join(', ')}`
    )
  }
  lines.push(`- **Tested**: ${c.hasTest ? 'yes' : 'no'} · **Story**: ${c.hasStory ? 'yes' : 'no'}`)
  lines.push('')

  if (c.propTypes.length === 0) {
    lines.push('_No props extracted. Inspect source for API._')
  } else {
    for (const pt of c.propTypes) {
      const tag = pt.exported ? 'exported' : 'internal'
      lines.push(`#### \`${pt.name}\` _(${tag}, from \`${pt.source}\`)_`)
      lines.push('')
      lines.push(renderPropsTable(pt))
      if (pt.extendsDom) {
        lines.push(`Extends DOM attrs: \`${pt.extendsDom}\``)
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

function buildMarkdown(
  spec: Spec,
  tokens: ReturnType<typeof readTokens>,
  colors: string[]
): string {
  const out: string[] = []

  out.push('# illog Design System — Full Spec for AI Agents')
  out.push('')
  out.push(
    `> Auto-generated. Do not edit by hand. Regenerate via \`pnpm --filter @illog/ui gen:ai-context\`.`
  )
  out.push(`> Last generated: ${spec.generatedAt}`)
  out.push(`> Components: ${spec.componentCount}`)
  out.push('')

  out.push('## How to use this file')
  out.push('')
  out.push(
    'You are an AI agent building UI for the illog desktop app. Before writing any UI code, read the rules in `CLAUDE.md` and `packages/ui/CLAUDE.md`. This file is the complete component + token reference. Always import from `@illog/ui`. Never invent new primitives. Never hardcode colors, spacing, radius, or font values — use the tokens in this file.'
  )
  out.push('')

  out.push('## Hard rules')
  out.push('')
  out.push(
    [
      '1. Import components from `@illog/ui` only. No deep imports from `@illog/ui/src/...`.',
      '2. Use `@illog/themes` tokens via `@illog/ui` sprinkles or recipes. No raw hex, rgb, or magic px values.',
      '3. New UI primitives go in `packages/ui/src/components/<Name>/`, never in `services/app`.',
      '4. Use `@vanilla-extract/sprinkles` and `@vanilla-extract/recipes`. No Tailwind, no CSS modules, no styled-components.',
      '5. Boolean props: `is*` / `has*`. Variants: string union literals, never enums.',
      '6. Compound components expose `use<Name>Context` hook. See `Selector` for the canonical pattern.'
    ].join('\n')
  )
  out.push('')

  out.push('## Design tokens')
  out.push('')

  out.push('### Colors (CSS variables)')
  out.push('')
  out.push(renderColorVars(colors))
  out.push('')

  out.push(renderTokenTable('Spacing (`space`, in px; 8px grid + half-steps)', tokens.space))
  out.push(renderTokenTable('Radius', tokens.radius))
  out.push(renderTokenTable('Icon size', tokens.icon))
  out.push(renderTokenTable('Blur', tokens.blur))
  out.push(renderTokenTable('Depth (z-index/elevation)', tokens.depth))
  out.push(renderTokenTable('Stroke', tokens.stroke))

  if (Object.keys(tokens.responsive).length > 0) {
    out.push('### Responsive breakpoints')
    out.push('')
    for (const [k, v] of Object.entries(tokens.responsive)) {
      out.push(`- **${k}**: ${JSON.stringify(v)}`)
    }
    out.push('')
  }

  if (Object.keys(tokens.typography).length > 0) {
    out.push('### Typography')
    out.push('')
    for (const [k, v] of Object.entries(tokens.typography)) {
      out.push(`**${k}**`)
      out.push('')
      for (const [kk, vv] of Object.entries(v)) {
        out.push(`- ${kk}: \`${vv}\``)
      }
      out.push('')
    }
  }

  out.push('## Components')
  out.push('')
  for (const c of spec.components) {
    out.push(renderComponent(c))
    out.push('')
    out.push('---')
    out.push('')
  }

  return out.join('\n')
}

function main() {
  const spec = readSpec()
  const tokens = readTokens()
  const colors = readColorVarNames()
  const md = buildMarkdown(spec, tokens, colors)

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, md)
  const size = (fs.statSync(outputPath).size / 1024).toFixed(1)
  console.log(
    `✅ ${spec.componentCount} components, ${colors.length} color vars → ${path.relative(
      process.cwd(),
      outputPath
    )} (${size} KB)`
  )
}

main()
