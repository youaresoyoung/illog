import { tokens } from '@illog/themes'
import { mkdirSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

type ThemeTokens = typeof import('@illog/themes').tokens

const toKebab = (raw: unknown) => {
  const str = String(raw)
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase -> kebab
    .replace(/[_\s]+/g, '-') // underscores/spaces -> hyphen
    .replace(/[^a-zA-Z0-9-]/g, '-') // sanitize any other chars
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/(^-|-$)/g, '') // trim leading/trailing hyphen
    .toLowerCase()
}

const isObject = (value: unknown) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const flatten = (
  obj: Record<string, unknown>,
  prefix = ''
): Array<{ name: string; value: string }> => {
  const result: Array<{ name: string; value: string }> = []

  for (const [key, value] of Object.entries(obj)) {
    const segment = toKebab(key)
    const objKey = prefix ? `${prefix}-${segment}` : segment
    if (isObject(value)) {
      const hasNested = Object.values(value as object).some(isObject)
      if (!hasNested) {
        for (const [subKey, subValue] of Object.entries(value as object)) {
          const name = `${objKey}-${toKebab(subKey)}`
          if (isObject(subValue)) {
            result.push(...flatten({ [subKey]: subValue }, `${objKey}`))
          } else {
            result.push({ name, value: String(subValue) })
          }
        }
        continue
      }
      result.push(...flatten(value as Record<string, unknown>, key))
    } else if (Array.isArray(value)) {
      result.push({ name: objKey, value: value.join(',') })
    } else {
      result.push({ name: objKey, value: String(value) })
    }
  }

  return result
}

const generateThemeCSSVariables = (tokens: ThemeTokens) => {
  const blocks: string[] = []

  const addBlock = (selector: string, obj: Record<string, unknown>) => {
    const flat = flatten(obj)
    const lines = flat.map(({ name, value }) => `  --${name}: ${value};`)
    blocks.push(`${selector} {\n${lines.join('\n')}\n}`)
  }

  if (tokens.colors) {
    if (tokens.colors.light) {
      addBlock(`:root`, tokens.colors.light)
    }
    if (tokens.colors.dark) {
      addBlock(`:root .theme-dark`, tokens.colors.dark)
    }
  }

  ;['size', 'typography'].forEach((moduleName) => {
    const moduleTokens = tokens[moduleName]
    if (moduleTokens) {
      blocks.push(`/* ${moduleName} */`)
      addBlock(`:root`, moduleTokens)
    }
  })

  return blocks
}

const generateThemeCSS = (tokens: ThemeTokens) => {
  const variables = generateThemeCSSVariables(tokens)

  mkdirSync('dist', { recursive: true })
  const cssPath = 'dist/themes.css'
  writeFileSync(cssPath, variables.join('\n\n'), 'utf-8')

  // NOTE: Formatting with Prettier after writing files
  try {
    execSync(`prettier --write "${cssPath}"`, { stdio: 'ignore' })
  } catch {
    console.warn('⚠️  Prettier formatting failed, but file was generated')
  }

  console.log('✅ Successfully generated dist/themes.css')
}

generateThemeCSS(tokens)
