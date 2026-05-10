export function parseColor(value: string) {
  // Match: #RRGGBB or #RGB
  const hexMatch = value.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16) / 255,
      g: parseInt(hexMatch[2], 16) / 255,
      b: parseInt(hexMatch[3], 16) / 255,
      a: 1
    }
  }

  const hex3 = value.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i)
  if (hex3) {
    return {
      r: parseInt(hex3[1] + hex3[1], 16) / 255,
      g: parseInt(hex3[2] + hex3[2], 16) / 255,
      b: parseInt(hex3[3] + hex3[3], 16) / 255,
      a: 1
    }
  }

  const rgbaMatch = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d+)\s*\)$/)
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10) / 255,
      g: parseInt(rgbaMatch[2], 10) / 255,
      b: parseInt(rgbaMatch[3], 10) / 255,
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1
    }
  }

  return null
}

export function generateColorSvg(hexColor: string): string {
  const svg = `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" rx="3" fill="${hexColor}" stroke="#888" stroke-width="0.5"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
