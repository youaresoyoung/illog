import fs from 'fs'
import { createRequire } from 'module'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const themesPath = require.resolve('@illog/themes/themes.css')

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const outputPath = path.resolve(__dirname, '../src/core/tokens/generatedColors.ts')

const css = fs.readFileSync(themesPath, 'utf-8')
const lightCss = css.match(/:root\s*{([\s\S]*?)}/)?.[1] ?? ''

function parseCssVars(block: string) {
  const regex = /--([a-z0-9\-]+)\s*:\s*([^;]+);/gi
  const result: Record<string, string> = {}
  let match
  while ((match = regex.exec(block)) !== null) {
    const [_, name] = match

    const camelCaseName = name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
    result[camelCaseName] = `var(--${name})`
  }

  return result
}

function groupByPrefix(colors: Record<string, string>) {
  const grouped: Record<string, Record<string, string>> = {}

  for (const key in colors) {
    const match = key.match(/^([a-z]+)/)
    if (!match) continue
    const prefix = match[1] + 'Colors'
    if (!grouped[prefix]) grouped[prefix] = {}
    grouped[prefix][key] = colors[key]
  }

  return grouped
}

const lightColorsFlat = parseCssVars(lightCss)
const groupedColors = groupByPrefix(lightColorsFlat)

let fileContent = '// ⚠️ Auto-generated file - Do not edit\n\n'
for (const groupName in groupedColors) {
  fileContent += `export const ${groupName} = ${JSON.stringify(groupedColors[groupName], null, 2)} as const;\n\n`
}

fs.writeFileSync(outputPath, fileContent)
console.log('✅ Successfully generated generatedColors.ts')
