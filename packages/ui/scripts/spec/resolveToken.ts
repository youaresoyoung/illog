import { styles, tokens } from '@illog/themes'
import * as generatedColors from '../../src/core/tokens/generatedColors'
import { getIn, toKebab } from './utils'
import { ResolvedToken } from './types'

/**
 * generatedColors 의 모든 `var(--x)` 문자열 -> camelCase 키 역방향 색인.
 * 토큰 하나 해석할 때마다 전체를 다시 훑을 이유가 없어 첫 호출에만 만든다.
 */
let colorKeyMap: Map<string, string> | undefined

function getColorKeyMap() {
  if (colorKeyMap) return colorKeyMap

  colorKeyMap = new Map<string, string>()
  for (const group of Object.values(generatedColors)) {
    for (const [key, value] of Object.entries(group as Record<string, string>)) {
      const match = /^var\((--[a-z0-9-]+)\)$/.exec(value)
      if (match) colorKeyMap.set(match[1], key)
    }
  }

  return colorKeyMap
}

export type TokenResolution = { ok: true; token: ResolvedToken } | { ok: false; error: string }

const fail = (error: string): TokenResolution => ({ ok: false, error })
const succeed = (token: ResolvedToken): TokenResolution => ({ ok: true, token })

/**
 * `$color.background.brand.default` 같은 참조를 실제 토큰으로 해석
 * (var(--color-background-brand-default) 같은 CSS 변수로 변환).
 * 실패를 값으로 돌려주므로 호출부가 예외 없이 Issue 로 모을 수 있다.
 */
export function tryResolveTokenRef(ref: string): TokenResolution {
  const [namespace, ...rest] = ref.slice(1).split('.')
  const refPath = rest.join('.')

  if (namespace === 'color') {
    const light = getIn(tokens.colors.light, rest)
    const dark = getIn(tokens.colors.dark, rest)
    if (light === undefined) return fail(`colors.light 에 ${refPath} 없음`)
    if (dark === undefined) return fail(`colors.light 에만 있고 colors.dark 에 없음: ${refPath}`)

    const cssVar = `--${rest.map(toKebab).join('-')}`
    const colorKey = getColorKeyMap().get(cssVar)
    if (!colorKey) {
      // 토큰은 있는데 generatedColors 에 안 실린 것.
      // 대개 @illog/themes 빌드가 오래됐거나 CSS 변수 네이밍 규칙이 바뀐 경우.
      return fail(`generatedColors 에 ${cssVar} 없음 (@illog/themes 재빌드 필요?)`)
    }
    return succeed({ display: `var(${cssVar})`, colorKey })
  }

  if (namespace === 'size') {
    const value = getIn(tokens.size, rest)
    if (value === undefined) return fail(`tokens.size 에 ${refPath} 없음`)
    return succeed({ display: typeof value === 'number' ? `${value}px` : String(value) })
  }

  if (namespace === 'text') {
    const value = getIn(styles.text, rest)
    if (value === undefined) return fail(`styles.text 에 ${refPath} 없음`)
    return succeed({ display: `styles.text.${refPath}` })
  }

  return fail(`알 수 없는 토큰 네임스페이스: $${namespace}`)
}

/** 해석에 실패할 리 없는 자리(= 이미 검증을 통과한 스펙)에서 쓰는 버전. 실패하면 던진다. */
export function resolveTokenRef(ref: string): ResolvedToken {
  const resolution = tryResolveTokenRef(ref)
  if (!resolution.ok) throw new Error(resolution.error)
  return resolution.token
}
