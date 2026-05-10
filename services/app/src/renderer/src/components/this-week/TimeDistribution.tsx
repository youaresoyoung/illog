import { TimeDistribution as UITimeDistribution } from '@illog/ui'
import { formatHoursDecimal } from '../../utils/this-week-stats'
import { DONUT_BACKGROUND_COLORS, DONUT_BORDER_COLORS } from '../../constant/color'
import type { ChartSegment } from '../../utils/category-analytics'

type Props = {
  segments: ChartSegment[]
  isLeaf?: boolean
  onSegmentClick?: (segment: ChartSegment) => void
}

export const TimeDistribution = ({ segments, isLeaf, onSegmentClick }: Props) => {
  const isClickable = !isLeaf && typeof onSegmentClick === 'function'

  return (
    <UITimeDistribution
      title="Time Distribution"
      items={segments}
      getKey={(segment) => segment.id}
      getValue={(segment) => segment.totalMinutes}
      getFillColor={(segment) =>
        DONUT_BACKGROUND_COLORS[segment.color] ?? DONUT_BACKGROUND_COLORS.gray
      }
      getStrokeColor={(segment) => DONUT_BORDER_COLORS[segment.color] ?? DONUT_BORDER_COLORS.gray}
      getLabel={(segment, context) =>
        `${segment.name} (${formatHoursDecimal(segment.totalMinutes)}, ${context.percentage.toFixed(0)}%)`
      }
      emptyMessage="No time data available"
      onItemClick={isClickable ? (segment) => onSegmentClick?.(segment) : undefined}
    />
  )
}
