import type { ReactNode } from 'react'
import type { DonutChartProps } from '../DonutChart'

export type TimeDistributionLegendContext = {
  index: number
  value: number
  percentage: number
}

export type TimeDistributionRenderItemParams<T> = {
  item: T
  index: number
  value: number
  percentage: number
  isClickable: boolean
  onClick?: () => void
}

export type TimeDistributionProps<T> = {
  title?: ReactNode
  items: T[]
  getValue: (item: T) => number
  getFillColor: (item: T) => string
  getStrokeColor?: (item: T) => string | undefined
  getLabel: (item: T, context: TimeDistributionLegendContext) => ReactNode
  getKey?: (item: T, index: number) => string
  onItemClick?: (item: T, index: number) => void
  isItemClickable?: (item: T, index: number) => boolean
  emptyMessage?: ReactNode
  chartSize?: number
  chartProps?: Omit<DonutChartProps, 'segments' | 'size' | 'onSegmentClick'>
  legendMaxWidth?: number
  legendDotSize?: number
  renderLegendItem?: (params: TimeDistributionRenderItemParams<T>) => ReactNode
  className?: string
}
