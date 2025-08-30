export const flattenTokens = <T extends Record<string, unknown>>(
  tokens: T,
  prefix = ''
): Record<string, string> => {
  return Object.entries(tokens).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'object' && value !== null) {
        Object.assign(acc, flattenTokens(value as Record<string, unknown>, newKey))
      } else {
        acc[newKey] = value as string
      }
      return acc
    },
    {} as Record<string, string>
  )
}
