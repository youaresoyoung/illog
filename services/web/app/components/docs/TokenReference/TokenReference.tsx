import { tokens, flattenTokens } from '@illog/themes'
import { TokenTable } from './TokenTable'

type TokenGroup =
  | 'colors.primitive'
  | 'colors.light'
  | 'colors.dark'
  | 'size.space'
  | 'size.radius'
  | 'size.depth'
  | 'size.blur'
  | 'size.stroke'
  | 'size.icon'
  | 'typography.primitive'
  | 'typography.typography'

interface TokenReferenceProps {
  group: TokenGroup
  unit?: string
}

function resolveTokenGroup(group: TokenGroup): Record<string, unknown> {
  const parts = group.split('.')
  let current: Record<string, unknown> = tokens as unknown as Record<string, unknown>
  for (const part of parts) {
    current = current[part] as Record<string, unknown>
  }
  return current
}

function isColorValue(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')
}

export function TokenReference({ group, unit }: TokenReferenceProps) {
  const tokenGroup = resolveTokenGroup(group)
  const flat = flattenTokens(tokenGroup)

  const items = Object.entries(flat).map(([path, value]) => {
    const strValue = String(value)
    return {
      path,
      value: unit ? `${strValue}${unit}` : strValue,
      rawValue: strValue,
      isColor: isColorValue(value)
    }
  })

  return <TokenTable items={items} />
}
