import { describeLocation, flattenDefinitions } from './flattenDefinitions'
import { tryResolveTokenRef } from './resolveToken'
import { ComponentSpec, PropRow, SpecRow } from './types'
import { formatDefault, quote } from './utils'

export function buildPropsTable(spec: ComponentSpec): PropRow[] {
  const rows: PropRow[] = []

  for (const [variant, def] of Object.entries(spec.variants ?? {})) {
    rows.push({
      name: variant,
      type: def.type === 'boolean' ? 'boolean' : (def.values ?? []).map(quote).join(' | '),
      default: def.default === undefined ? null : formatDefault(def.default),
      required: def.required ?? false,
      description: def.description ?? ''
    })
  }

  for (const [name, def] of Object.entries(spec.props)) {
    rows.push({
      name,
      type: def.type,
      default: def.default === undefined ? null : formatDefault(def.default),
      required: def.required ?? false,
      description: def.description ?? ''
    })
  }

  return rows
}

/**
 * checkSemantics 를 통과한 스펙을 전제로 한다.
 * 그래도 해석에 실패하면 어디서 터졌는지 알 수 있게 위치를 붙여 던진다.
 */
export function buildSpecTable(spec: ComponentSpec): SpecRow[] {
  const rows: SpecRow[] = []

  for (const entry of flattenDefinitions(spec)) {
    const { selector, state, element, property, value } = entry

    if (typeof value === 'string') {
      const resolution = tryResolveTokenRef(value)
      if (!resolution.ok) {
        throw new Error(
          `${describeLocation(entry)}: ${resolution.error} (checkSemantics 로 먼저 검증할 것)`
        )
      }
      rows.push({
        selector,
        state,
        element,
        property,
        token: value,
        value: resolution.token.display
      })
    } else {
      rows.push({
        selector,
        state,
        element,
        property,
        token: null,
        value: String(value.raw),
        reason: value.reason
      })
    }
  }

  return rows
}
