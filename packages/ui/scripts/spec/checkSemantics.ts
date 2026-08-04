import { describeLocation, flattenDefinitions, parseSelector } from './flattenDefinitions'
import { tryResolveTokenRef } from './resolveToken'
import { ComponentSpec, Issue } from './types'

/**
 * 스키마(형식)를 통과한 스펙에 대해 의미를 검사한다.
 * - 선언되지 않은 variant/값/state/element 를 참조하지 않는지
 * - 토큰 참조가 실제로 해석되는지
 * 형식 검사는 loadSpecs 의 JSON Schema 가 이미 끝낸 상태라고 가정한다.
 */
export function checkSemantics(spec: ComponentSpec, file: string): Issue[] {
  const issues: Issue[] = []
  const error = (message: string) => issues.push({ level: 'error', file, message })
  const warn = (message: string) => issues.push({ level: 'warn', file, message })

  const variants = spec.variants ?? {}
  const elements = spec.elements ?? {}
  const states = spec.states ?? ['enabled']

  // variants 자체의 앞뒤가 맞는지
  for (const [variant, def] of Object.entries(variants)) {
    if (def.type === 'enum') {
      if ((def.values?.length ?? 0) === 0) {
        error(`variants.${variant}: type=enum 인데 values 가 없음`)
      }
      if (def.default !== undefined && !def.values?.includes(String(def.default))) {
        error(`variants.${variant}: default '${def.default}' 가 values 에 없음`)
      }
    }
    if (def.default !== undefined && def.required) {
      warn(`variants.${variant}: default 와 required 가 동시에 있음`)
    }
  }

  // selector 가 선언된 variant/값만 참조하는지
  for (const selector of Object.keys(spec.definitions ?? {})) {
    for (const { variant, value } of parseSelector(selector)) {
      const def = variants[variant]
      if (!def) {
        error(`definitions['${selector}']: 선언되지 않은 variant '${variant}'`)
      } else if (def.type === 'enum' && !def.values?.includes(value)) {
        error(`definitions['${selector}']: '${variant}' 에 없는 값 '${value}'`)
      }
    }
  }

  // state/element 검사는 (selector, state, element) 당 한 번만 보고한다
  const reported = new Set<string>()
  const once = (key: string, report: () => void) => {
    if (reported.has(key)) return
    reported.add(key)
    report()
  }

  for (const entry of flattenDefinitions(spec)) {
    const { selector, state, element, value } = entry

    if (!states.includes(state)) {
      once(`state:${selector}:${state}`, () =>
        error(`definitions['${selector}']: states 에 없는 상태 '${state}'`)
      )
    }
    if (!(element in elements)) {
      once(`element:${selector}:${state}:${element}`, () =>
        error(`definitions['${selector}'].${state}: 선언되지 않은 element '${element}'`)
      )
    }

    const where = describeLocation(entry)
    if (typeof value === 'string') {
      const resolution = tryResolveTokenRef(value)
      if (!resolution.ok) error(`${where}: ${resolution.error}`)
    } else {
      warn(`${where}: 토큰 밖 값 '${value.raw}' (${value.reason})`)
    }
  }

  // 선언만 되고 어디서도 스타일이 정의되지 않은 variant 값
  const styledPairs = new Set(
    Object.keys(spec.definitions ?? {}).flatMap((selector) =>
      parseSelector(selector).map(({ variant, value }) => `${variant}=${value}`)
    )
  )
  for (const [variant, def] of Object.entries(variants)) {
    if (def.type !== 'enum') continue
    for (const value of def.values ?? []) {
      if (!styledPairs.has(`${variant}=${value}`)) {
        warn(`'${variant}=${value}' 에 대한 definitions 가 없음 (스타일 미구현?)`)
      }
    }
  }

  return issues
}
