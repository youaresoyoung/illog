import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { tokens } from '@illog/themes'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dir = join(__dirname, '../src/assets/svg')
const files = readdirSync(dir).filter((file) => file.endsWith('.svg'))

const fillDefaultColorRegEx = new RegExp(`fill="${tokens.colors.light.icon.default.default}"`, 'gi')
const strokeDefaultColorRegEx = new RegExp(
  `stroke="${tokens.colors.light.icon.default.default}"`,
  'gi'
)

files.forEach((file) => {
  if (file.endsWith('.svg')) {
    let content = readFileSync(join(dir, file), 'utf8')
    content = content.replace(fillDefaultColorRegEx, 'fill="currentColor"')
    content = content.replace(strokeDefaultColorRegEx, 'stroke="currentColor"')
    writeFileSync(join(dir, file), content)
  }
})

function replaceNameInFile(file: string) {
  return file.replace('.svg', '').replace('ic_', '').replace('_24', '')
}

const imports = files
  .map((file) => {
    const name = replaceNameInFile(file)
    return `import ${name} from './${file}';`
  })
  .join('\n')

const iconNames = files.map((file) => `'${replaceNameInFile(file)}'`).join(' | ')
const iconExports = files
  .map((file) => {
    const name = replaceNameInFile(file)
    return `  ${name}`
  })
  .join(',\n')
const iconNameOptions = files
  .map((file) => {
    const name = replaceNameInFile(file)
    return `  "${name}"`
  })
  .join(',\n')

const iconNameType = `export type IconName = ${iconNames};\n`
const iconNameOptionsExport = `export const IconNameOptions: IconName[] = [\n${iconNameOptions}\n];\n`
const iconDefaultExport = `export default {\n${iconExports}\n};\n`

writeFileSync(join(__dirname, '../src/assets/svg/index.ts'), `${imports}\n\n${iconDefaultExport}`)
writeFileSync(
  join(__dirname, '../src/components/Icon/types.ts'),
  `${iconNameType}\n${iconNameOptionsExport}`
)

let fileContent = '// ⚠️ Auto-generated file - Do not edit\n\n'
fileContent += `${imports}\n\n${iconDefaultExport}`
writeFileSync(join(__dirname, '../src/assets/svg/index.ts'), fileContent)

fileContent = '// ⚠️ Auto-generated file - Do not edit\n\n'
fileContent += `${iconNameType}\n${iconNameOptionsExport}`
writeFileSync(join(__dirname, '../src/components/Icon/types.ts'), fileContent)

// NOTE: Formatting with Prettier after writing files
const svgIndexPath = join(__dirname, '../src/assets/svg/index.ts')
const iconTypesPath = join(__dirname, '../src/components/Icon/types.ts')

try {
  execSync(`prettier --write "${svgIndexPath}" "${iconTypesPath}"`, { stdio: 'ignore' })
} catch {
  console.warn('⚠️  Prettier formatting failed, but files were generated')
}

console.log('✅ Successfully generated svg/index.ts')
console.log('✅ Successfully generated components/Icon/types.ts')
