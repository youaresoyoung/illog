/**
 * scripts/figma-push/export-tokens.ts
 *
 * Reads packages/themes/src/tokens/** and writes a W3C DTCG-formatted JSON
 * file at scripts/figma-push/tokens.dtcg.json. The companion Figma plugin
 * (scripts/figma-push/plugin/) imports that JSON into Figma Variables.
 *
 * DTCG reference: https://design-tokens.github.io/community-group/format/
 *
 * Each token is an object with:
 *   { "$type": "color" | "dimension" | "fontWeight" | "fontFamily" | "duration" | "number",
 *     "$value": <value> }
 *
 * We do not depend on style-dictionary or @tokens-studio/sd-transforms; this
 * is intentionally tiny so it stays trivially auditable.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '../..')
const themesRoot = path.join(repoRoot, 'packages/themes/src/tokens')
const outputPath = path.join(__dirname, 'tokens.dtcg.json')

type Primitive = string | number
type DtcgToken = { $type: string; $value: Primitive | Record<string, unknown> }
type DtcgGroup = { [key: string]: DtcgToken | DtcgGroup }

/* ---------- helpers ---------- */

/**
 * Extract `export const <name> = { ... }` object literals from a TS source
 * file using a regex. Token files in this repo are flat objects of primitives
 * so we don't need a real parser.
 */
function extractObjectExports(filePath: string): Record<string, Record<string, Primitive>> {
  if (!fs.existsSync(filePath)) return {}
  const src = fs.readFileSync(filePath, 'utf-8')
  const result: Record<string, Record<string, Primitive>> = {}

  const re = /export const (\w+)\s*=\s*\{([\s\S]*?)\n\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    const name = m[1]
    const body = m[2]
    const obj: Record<string, Primitive> = {}
    const lineRe = /['"]?([\w-]+)['"]?\s*:\s*([^,\n}]+)[,\n]/g
    let lm: RegExpExecArray | null
    while ((lm = lineRe.exec(body + '\n')) !== null) {
      const key = lm[1]
      let val: Primitive = lm[2].trim().replace(/['"]/g, '')
      const num = Number(val)
      if (!Number.isNaN(num) && val !== '') val = num
      obj[key] = val
    }
    result[name] = obj
  }
  return result
}

function dimensionToken(value: Primitive): DtcgToken {
  if (typeof value === 'number') return { $type: 'dimension', $value: { value, unit: 'px' } }
  return { $type: 'dimension', $value: String(value) }
}

function numberToken(value: Primitive): DtcgToken {
  return { $type: 'number', $value: typeof value === 'number' ? value : Number(value) }
}

function colorToken(value: string): DtcgToken {
  return { $type: 'color', $value: value }
}

function flattenSizeGroup(
  source: Record<string, Primitive>,
  type: 'dimension' | 'number'
): DtcgGroup {
  const out: DtcgGroup = {}
  for (const [k, v] of Object.entries(source)) {
    out[k] = type === 'dimension' ? dimensionToken(v) : numberToken(v)
  }
  return out
}

/* ---------- color extraction ---------- */

/**
 * Pull semantic color tokens from packages/themes/dist/themes.css when
 * available; otherwise fall back to a placeholder note. We do not parse the
 * raw TS color objects directly because they reference each other through
 * type-only structures that the regex parser cannot resolve.
 */
function readColorTokensFromCss(): DtcgGroup {
  const cssPath = path.join(repoRoot, 'packages/themes/dist/themes.css')
  if (!fs.existsSync(cssPath)) return {}
  const css = fs.readFileSync(cssPath, 'utf-8')
  const root = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? ''
  const out: DtcgGroup = {}
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(root)) !== null) {
    const name = m[1]
    const raw = m[2].trim()
    // Only record tokens that resolve to a literal hex/rgb color, not refs.
    if (/^#|^rgb|^hsl/.test(raw)) {
      // Group by the prefix segment, e.g. background-default-default → background.default.default
      const segments = name.split('-')
      let cursor: DtcgGroup = out
      for (let i = 0; i < segments.length - 1; i++) {
        const seg = segments[i]
        cursor[seg] ??= {}
        cursor = cursor[seg] as DtcgGroup
      }
      const leaf = segments[segments.length - 1]
      cursor[leaf] = colorToken(raw)
    }
  }
  return out
}

/* ---------- main ---------- */

function main() {
  const space = extractObjectExports(path.join(themesRoot, 'size/space.ts')).space ?? {}
  const radius = extractObjectExports(path.join(themesRoot, 'size/radius.ts')).radius ?? {}
  const icon = extractObjectExports(path.join(themesRoot, 'size/icon.ts')).icon ?? {}
  const stroke = extractObjectExports(path.join(themesRoot, 'size/stroke.ts')).stroke ?? {}
  const blur = extractObjectExports(path.join(themesRoot, 'size/blur.ts')).blur ?? {}
  const depth = extractObjectExports(path.join(themesRoot, 'size/depth.ts')).depth ?? {}

  const colors = readColorTokensFromCss()

  const dtcg: DtcgGroup = {
    $description: 'illog design tokens — auto-generated from packages/themes/src/tokens',
    color: colors,
    size: {
      space: flattenSizeGroup(space, 'dimension'),
      radius: flattenSizeGroup(radius, 'dimension'),
      icon: flattenSizeGroup(icon, 'dimension'),
      stroke: flattenSizeGroup(stroke, 'dimension'),
      blur: flattenSizeGroup(blur, 'dimension'),
      depth: flattenSizeGroup(depth, 'number')
    }
  } as DtcgGroup

  fs.writeFileSync(outputPath, JSON.stringify(dtcg, null, 2) + '\n')

  const colorCount = countTokens(colors)
  const sizeCount =
    Object.keys(space).length +
    Object.keys(radius).length +
    Object.keys(icon).length +
    Object.keys(stroke).length +
    Object.keys(blur).length +
    Object.keys(depth).length
  console.log(
    `✅ ${colorCount} color tokens, ${sizeCount} size tokens → ${path.relative(
      process.cwd(),
      outputPath
    )}`
  )
  if (colorCount === 0) {
    console.log(
      '   (color section empty — run `pnpm --filter @illog/themes build:css` to populate themes.css first)'
    )
  }
}

function countTokens(group: DtcgGroup): number {
  let n = 0
  for (const v of Object.values(group)) {
    if (v && typeof v === 'object' && '$type' in v) n++
    else if (v && typeof v === 'object') n += countTokens(v as DtcgGroup)
  }
  return n
}

main()
