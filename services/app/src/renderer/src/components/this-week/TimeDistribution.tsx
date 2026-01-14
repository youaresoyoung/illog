import { Inline, Stack, Text } from '@illog/ui'
import { DonutChart } from './DonutChart'
import type { TaskWithTags } from '../../../../shared/types'
import { calculateCategoryStats } from '../../utils/thisWeekStats'

const TAG_COLORS: Record<string, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  red: '#ef4444',
  gray: '#6b7280'
}

type Props = {
  tasks: TaskWithTags[]
}

export const TimeDistribution = ({ tasks }: Props) => {
  const categories = calculateCategoryStats(tasks)

  if (categories.length === 0) {
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
      <Inline gap="600" align="center">
        <DonutChart categories={categories} />
        <Stack gap="200">
          {categories.map((category) => (
            <Inline key={category.tagId} gap="200" align="center">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: TAG_COLORS[category.tagColor] || TAG_COLORS.gray
                }}
              />
              <Text textStyle="caption" color="textDefaultSecondary">
                {category.tagName}
              </Text>
            </Inline>
          ))}
        </Stack>
      </Inline>
    </Stack>
  )
}
