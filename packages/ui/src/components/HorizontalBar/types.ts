import type { CSSProperties, HTMLAttributes } from 'react'

export type HorizontalBarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  value: number
  min?: number
  max?: number
  height?: number
  radius?: number
  fillColor?: string
  trackColor?: string
  isAnimated?: boolean
  trackStyle?: CSSProperties
  fillStyle?: CSSProperties
  ariaLabel?: string
}
