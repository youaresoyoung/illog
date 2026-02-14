import { useMemo } from 'react'
import { DonutChart as UIDonutChart, type DonutChartSegment } from '@illog/ui'
import type { ChartSegment } from '../../utils/category-analytics'
import { DONUT_BACKGROUND_COLORS, DONUT_BORDER_COLORS } from '../../constant/color'

type Props = {
  segments: ChartSegment[]
  size?: number
}

export const DonutChart = ({ segments, size = 180 }: Props) => {
  const chartSegments = useMemo<DonutChartSegment[]>(
    () =>
      segments.map((segment) => ({
        id: segment.id,
        value: segment.totalMinutes,
        fill: DONUT_BACKGROUND_COLORS[segment.color] ?? DONUT_BACKGROUND_COLORS.gray,
        stroke: DONUT_BORDER_COLORS[segment.color] ?? DONUT_BORDER_COLORS.gray
      })),
    [segments]
  )

  return <UIDonutChart segments={chartSegments} size={size} />
}
