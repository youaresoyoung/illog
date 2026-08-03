import { loadSpecs } from './loadSpecs'

const isStrict = process.argv.includes('--strict')
const { specs, issues } = loadSpecs()

const errors = issues.filter((i) => i.level === 'error')
const warnings = issues.filter((i) => i.level === 'warn')

for (const issue of issues) {
  const icon = issue.level === 'error' ? '❌' : '⚠️'
  console.log(`${icon} ${issue.file}: ${issue.message}`)
}

console.log(
  `\n총 ${specs.length}개의 스펙을 검사했습니다. (${errors.length} 에러, ${warnings.length} 경고)`
)

if (errors.length > 0 || (isStrict && warnings.length > 0)) process.exit(1)
