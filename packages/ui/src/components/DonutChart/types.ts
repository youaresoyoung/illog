import type { SVGAttributes } from 'react'

export type DonutChartSegment = {
  id?: string
  value: number
  fill: string
  stroke?: string
  strokeWidth?: number
  ariaLabel?: string
}

export type DonutChartProps = Omit<SVGAttributes<SVGSVGElement>, 'onClick'> & {
  segments: DonutChartSegment[]
  size?: number
  innerRatio?: number
  startAngle?: number
  defaultStrokeWidth?: number
  emptyFill?: string
  emptyStroke?: string
  onSegmentClick?: (segment: DonutChartSegment, index: number) => void
  segmentKey?: (segment: DonutChartSegment, index: number) => string
}
