/**
 * spec/*.yaml -> 생성물 2개.
 *
 *   spec/__generated__/spec.json   기계용 통합 스펙 (services/web 이 소비)
 *   src/__generated__/spec.types.ts  variant union (components/ * /types.ts 가 소비)
 *
 * 둘 다 git 에 커밋한다. codegen 을 돌리지 않아도 에디터와 typecheck 가 동작해야 하기 때문이다.
 * (generatedColors.ts 와 동일한 정책)
 */

import { loadSpecs } from './loadSpecs'
import { buildPropsTable, buildSpecTable } from './buildTables'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import type { ComponentSpec } from './types'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = resolve(scriptDir, '../..')
const SPEC_JSON = join(PACKAGE_ROOT, 'spec/__generated__/spec.json')
const SPEC_TYPES = join(PACKAGE_ROOT, 'src/__generated__/spec.types.ts')

const BANNER = '// ⚠️ Auto-generated from packages/ui/spec - Do not edit'
const SPEC_BANNER = '// ⚠️ Auto-generated from packages/ui/spec/*.yaml - Do not edit'

const { specs, issues } = loadSpecs()
const errors = issues.filter((i) => i.level === 'error')

if (errors.length > 0) {
  for (const issue of errors) {
    console.error(`❌ ${issue.file}: ${issue.message}`)
  }
  console.error(`\n스펙에 error 가 있어 생성을 중단합니다. pnpm run spec:validate 로 확인하세요.\n`)
  process.exit(1)
}

function writeFile(filePath: string, content: string) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)

  try {
    execSync(`npx prettier --write ${filePath}`, { stdio: 'ignore' })
  } catch {
    console.warn(`⚠️ Prettier formatting failed for ${filePath}. Please check the file manually.`)
  }
}

// spec.json
const components = Object.fromEntries(
  specs.map((spec) => [
    spec.id,
    {
      id: spec.id,
      name: spec.name,
      description: spec.description,
      status: spec.status,
      elements: spec.elements,
      variants: spec.variants,
      states: spec.states,
      extends: spec.extends,
      propsTable: buildPropsTable(spec),
      specTable: buildSpecTable(spec)
    }
  ])
)
writeFile(SPEC_JSON, JSON.stringify({ $generated: SPEC_BANNER, components }, null, 2))

// spec.types.ts
const pascal = (specId: string) =>
  specId
    .split(/[-_]/)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('')

const typeLines = specs.flatMap((spec: ComponentSpec) =>
  Object.entries(spec.variants || {}).map(([variantName, variantDef]) => {
    const variantType =
      variantDef.type === 'enum' ? variantDef.values?.map((v) => `'${v}'`).join(' | ') : 'boolean'
    return `export type ${pascal(spec.id)}${pascal(variantName)} = ${variantType};`
  })
)
writeFile(SPEC_TYPES, `${BANNER}\n\n${typeLines.join('\n')}\n`)

console.log(
  `✅ spec.json 과 spec.types.ts 를 생성했습니다. (컴포넌트 ${specs.length}개, 타입 ${typeLines.length}개)`
)
