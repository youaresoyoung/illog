import { ComponentSpec, SpecValue } from './types'

export type SelectorPart = { variant: string; value: string }

/**
 * selector 문법을 해석하는 단 한 곳. selector 는 `variant=value` 를 공백으로 이은 형태다.
 *
 *   'size=md'          -> [{ variant: 'size', value: 'md' }]
 *   'size=md isFullWidth=true' -> 두 개
 *   'base'             -> [] (조건 없음)
 */
export function parseSelector(selector: string): SelectorPart[] {
  if (selector === 'base') return []

  return selector.split(' ').map((pair) => {
    const [variant, value] = pair.split('=')
    return { variant, value }
  })
}

export type DefinitionEntry = {
  selector: string
  state: string
  element: string
  property: string
  value: SpecValue
}

/**
 * definitions 의 4중 중첩(selector -> state -> element -> property)을 평평하게 편다.
 * 의미 검사와 표 생성이 같은 순회를 공유해, 스펙 구조가 바뀔 때 고칠 곳이 하나로 유지된다.
 */
export function* flattenDefinitions(spec: ComponentSpec): Generator<DefinitionEntry> {
  for (const [selector, byState] of Object.entries(spec.definitions ?? {})) {
    for (const [state, byElement] of Object.entries(byState)) {
      for (const [element, properties] of Object.entries(byElement)) {
        for (const [property, value] of Object.entries(properties)) {
          yield { selector, state, element, property, value }
        }
      }
    }
  }
}

/** 이슈 메시지와 에러에서 공통으로 쓰는 위치 표기 */
export function describeLocation({ selector, state, element, property }: DefinitionEntry) {
  return `definitions['${selector}'].${state}.${element}.${property}`
}
