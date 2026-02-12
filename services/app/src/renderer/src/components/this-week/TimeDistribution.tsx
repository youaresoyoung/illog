import { Box, Inline, Stack, Text } from '@illog/ui'
import { DonutChart } from './DonutChart'
import { formatHoursDecimal } from '../../utils/this-week-stats'
import { DONUT_BACKGROUND_COLORS, DONUT_BORDER_COLORS } from '../../constant/color'
import { ChartSegment } from '../../utils/category-analytics'

type Props = {
  segments: ChartSegment[]
  isLeaf: boolean
  onSegmentClick: (segment: ChartSegment) => void
}

export const TimeDistribution = ({ segments, isLeaf, onSegmentClick }: Props) => {
  const isClickable = !isLeaf

  if (segments.length === 0) {
    return (
      <Stack gap="400">
        <Text textStyle="bodyStrong" color="textDefaultDefault">
          Time Distribution
        </Text>
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          No time data available
        </Text>
      </Stack>
    )
  }
  return (
    <Stack gap="400">
      <Text textStyle="bodyStrong" color="textDefaultDefault">
        Time Distribution
      </Text>
      <Stack gap="600" align="center" bg="backgroundDefaultDefault" rounded="200" px="400" py="800">
        <DonutChart segments={segments} />
        <Inline gap="200" wrap="wrap" justify="center">
          {segments.map((segment) => (
            <Inline
              maxWidth={240}
              key={segment.id}
              gap="200"
              align="center"
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
              onClick={isClickable ? () => onSegmentClick(segment) : undefined}
              overflow="hidden"
            >
              {/* TODO: Create Dot UI component */}
              <Box
                flexShrink={0}
                w="12px"
                h="12px"
                rounded="full"
                style={{
                  backgroundColor:
                    DONUT_BACKGROUND_COLORS[segment.color] || DONUT_BACKGROUND_COLORS.gray,
                  border: `1px solid ${DONUT_BORDER_COLORS[segment.color] || DONUT_BORDER_COLORS.gray}`
                }}
              />
              <Text textStyle="caption" color="textDefaultSecondary" truncate="true">
                {segment.name} ({formatHoursDecimal(segment.totalMinutes)},{' '}
                {segment.percentage.toFixed(0)}%)
              </Text>
            </Inline>
          ))}
        </Inline>
      </Stack>
    </Stack>
  )
}
