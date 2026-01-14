import { CSSProperties, useMemo } from 'react'
import type { CategoryStats } from '../../utils/thisWeekStats'

const TAG_COLORS: Record<string, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  red: '#ef4444',
  gray: '#6b7280'
}

type Props = {
  categories: CategoryStats[]
  size?: number
}

export const DonutChart = ({ categories, size = 180 }: Props) => {
  const conicGradient = useMemo(() => {
    if (categories.length === 0) {
      return 'conic-gradient(#e5e7eb 0deg 360deg)'
    }

    let currentDeg = 0
    const segments: string[] = []

    for (const category of categories) {
      const color = TAG_COLORS[category.tagColor] || TAG_COLORS.gray
      const endDeg = currentDeg + (category.percentage / 100) * 360

      segments.push(`${color} ${currentDeg}deg ${endDeg}deg`)
      currentDeg = endDeg
    }

    return `conic-gradient(${segments.join(', ')})`
  }, [categories])

  const chartStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: conicGradient,
    mask: 'radial-gradient(circle, transparent 55%, black 55%)',
    WebkitMask: 'radial-gradient(circle, transparent 55%, black 55%)'
  }

  return <div style={chartStyle} />
}
