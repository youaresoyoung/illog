export function getColorOptions(prefix: string, colorObject: Record<string, unknown>): string[] {
  const options: string[] = []

  function traverse(obj: Record<string, unknown>, path: string[] = []) {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const colorKey =
          prefix +
          path.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('') +
          key.charAt(0).toUpperCase() +
          key.slice(1)
        options.push(colorKey)
      } else if (typeof value === 'object' && value !== null) {
        traverse(value as Record<string, unknown>, [...path, key])
      }
    })
  }

  traverse(colorObject)
  return options
}
