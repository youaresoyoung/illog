/**
 * spec/*.yaml -> 생성물 2종.
 *
 *   spec/__generated__/spec.json                      기계용 통합 스펙 (services/web 이 소비)
 *   src/<sourceDir>/__generated__/spec.types.ts       variant union (컴포넌트 옆에 co-location)
 *
 * spec.json 만 한곳에 모으는 이유는 문서 사이트가 전체 목록을 한 번에 필요로 하기 때문이다.
 * 타입은 반대로 컴포넌트 폴더 안에 둔다 — 컴포넌트를 지우면 생성물도 같이 사라진다.
 *
 * 출력 위치는 id 에서 추론하지 않고 spec 의 sourceDir 을 따른다.
 * Selector/TagSelector 처럼 중첩된 컴포넌트가 있어 pascal(id) 규칙이 성립하지 않기 때문이다.
 *
 * 둘 다 git 에 커밋한다. codegen 을 돌리지 않아도 에디터와 typecheck 가 동작해야 하기 때문이다.
 * (generatedColors.ts 와 동일한 정책)
 */

import { loadSpecs } from './loadSpecs'
import { buildPropsTable, buildSpecTable } from './buildTables'
import { dirname, join, relative, resolve } from 'path'
import { fileURLToPath } from 'url'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = resolve(scriptDir, '../..')
const SRC_ROOT = join(PACKAGE_ROOT, 'src')
const SPEC_JSON = join(PACKAGE_ROOT, 'spec/__generated__/spec.json')

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

// sourceDir 은 파일을 하나라도 쓰기 전에 검증한다.
// mkdir -p 로 없는 경로를 만들어버리면 컴포넌트 없는 빈 폴더가 조용히 생긴다.
const brokenDirs = specs.filter(
  (spec) => spec.sourceDir && !existsSync(join(SRC_ROOT, spec.sourceDir))
)

if (brokenDirs.length > 0) {
  for (const spec of brokenDirs) {
    console.error(`❌ ${spec.id}: sourceDir 'src/${spec.sourceDir}' 가 존재하지 않습니다`)
  }
  console.error(
    `\n경로 오타이거나 컴포넌트가 삭제된 경우입니다. 폴더를 새로 만들지 않고 중단합니다.\n`
  )
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

// spec.types.ts — 컴포넌트별로 하나씩
const pascal = (specId: string) =>
  specId
    .split(/[-_]/)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('')

const written: string[] = []
const skipped: string[] = []
let typeCount = 0

for (const spec of specs) {
  if (!spec.sourceDir) {
    skipped.push(`${spec.id} (sourceDir 없음 — react: ${spec.status.react})`)
    continue
  }

  const typeLines = Object.entries(spec.variants ?? {}).map(([variantName, variantDef]) => {
    const variantType =
      variantDef.type === 'enum' ? variantDef.values?.map((v) => `'${v}'`).join(' | ') : 'boolean'
    return `export type ${pascal(spec.id)}${pascal(variantName)} = ${variantType};`
  })

  if (typeLines.length === 0) {
    skipped.push(`${spec.id} (variants 없음)`)
    continue
  }

  const outPath = join(SRC_ROOT, spec.sourceDir, '__generated__/spec.types.ts')
  writeFile(outPath, `${BANNER}\n\n${typeLines.join('\n')}\n`)

  written.push(relative(PACKAGE_ROOT, outPath))
  typeCount += typeLines.length
}

console.log(
  `✅ spec.json 1개, 타입 파일 ${written.length}개를 생성했습니다. (컴포넌트 ${specs.length}개, 타입 ${typeCount}개)`
)
for (const path of written) console.log(`   ${path}`)
for (const reason of skipped) console.log(`⏭️  건너뜀: ${reason}`)
