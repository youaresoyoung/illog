import type { ValidateFunction } from 'ajv'
import { Ajv2020 } from 'ajv/dist/2020'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'
import { checkSemantics } from './checkSemantics'
import { ComponentSpec, Issue, LoadResult } from './types'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))

export const SPEC_DIR = path.resolve(scriptDir, '../../spec')

export function schemaPathFor(specDir: string) {
  return path.join(specDir, '_schema/component.schema.json')
}

export const SCHEMA_PATH = schemaPathFor(SPEC_DIR)

/**
 * 스키마 컴파일은 파일 I/O 를 동반한다. import 시점에 하면 이 모듈을 스쳐 지나가는
 * 모든 코드(테스트 포함)가 스키마 파일 존재에 묶이므로, 첫 로드 때 한 번만 한다.
 */
const validators = new Map<string, ValidateFunction>()

function getValidator(schemaPath: string) {
  const cached = validators.get(schemaPath)
  if (cached) return cached

  const ajv = new Ajv2020({ allErrors: true, strict: false })
  const validate = ajv.compile(JSON.parse(readFileSync(schemaPath, 'utf-8')))
  validators.set(schemaPath, validate)
  return validate
}

export function loadSpecs(specDir: string = SPEC_DIR): LoadResult {
  const validateSchema = getValidator(schemaPathFor(specDir))

  const files = readdirSync(specDir)
    .filter((name) => name.endsWith('.yaml'))
    .sort()

  const specs: ComponentSpec[] = []
  const issues: Issue[] = []
  const seenIds = new Set<string>()

  for (const file of files) {
    const raw = parseYaml(readFileSync(path.join(specDir, file), 'utf-8'))

    if (!validateSchema(raw)) {
      for (const error of validateSchema.errors ?? []) {
        issues.push({
          level: 'error',
          file,
          message: `스키마 위반 ${error.instancePath || '/'}: ${error.message}`
        })
      }
      continue
    }

    const spec = raw as ComponentSpec
    const expectedId = file.replace(/\.yaml$/, '')
    if (spec.id !== expectedId) {
      issues.push({ level: 'error', file, message: `id 가 파일명과 다름 (${spec.id})` })
    }
    if (seenIds.has(spec.id)) {
      issues.push({ level: 'error', file, message: `id 중복: ${spec.id}` })
    }
    seenIds.add(spec.id)

    issues.push(...checkSemantics(spec, file))
    specs.push(spec)
  }

  return { specs, issues }
}
