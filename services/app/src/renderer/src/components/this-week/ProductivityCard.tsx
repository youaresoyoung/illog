import { Box, Inline, Stack, Text } from '@illog/ui'
import type { ChartSegment } from '../../utils/category-analytics'
import { formatHoursDecimal } from '../../utils/this-week-stats'
import { DONUT_BACKGROUND_COLORS, DONUT_BORDER_COLORS } from '../../constant/color'

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
        <Box
          flexShrink={0}
          w={'12px'}
          h={'12px'}
          rounded="full"
          style={{
            backgroundColor: DONUT_BACKGROUND_COLORS[segment.color] || DONUT_BACKGROUND_COLORS.gray,
            border: `1px solid ${DONUT_BORDER_COLORS[segment.color] || DONUT_BORDER_COLORS.gray}`
          }}
        />
        <Inline overflow="hidden" align="center" gap="200">
          <Text textStyle="bodyStrong" color="textDefaultDefault" flex="1" truncate="true">
            {segment.name}
          </Text>
          <Text textStyle="caption" color="textDefaultTertiary">
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
