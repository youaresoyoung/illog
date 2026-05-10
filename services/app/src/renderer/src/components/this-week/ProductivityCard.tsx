import { Badge, Inline, Stack, Text } from '@illog/ui'
import type { ChartSegment } from '../../utils/category-analytics'
import { formatHoursDecimal } from '../../utils/this-week-stats'

type Props = {
  segment: ChartSegment
  onClick?: () => void
  isClickable?: boolean
}

export const ProductivityCard = ({ segment, onClick, isClickable = true }: Props) => {
  return (
    <Stack
      gap="400"
      px="400"
      py="400"
      backgroundColor="backgroundDefaultDefault"
      borderRadius="200"
      minWidth={300}
      maxWidth={300}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
      onClick={isClickable ? onClick : undefined}
    >
      <Inline gap="200" align="center">
        <Inline overflow="hidden" align="center" gap="200">
          <Badge item={segment} withoutIcon={true} />
          <Text textStyle="caption" color="textDefaultTertiary" whiteSpace="nowrap" flexShrink={0}>
            {segment.taskCount} tasks
          </Text>
        </Inline>
      </Inline>
      <Stack gap="200">
        <Text textStyle="heading" color="textDefaultDefault">
          {formatHoursDecimal(segment.totalMinutes)}
        </Text>
        <Text textStyle="caption" color="textDefaultTertiary">
          {segment.percentage.toFixed(0)}% of total time
        </Text>
      </Stack>
    </Stack>
  )
}
