import { Inline, Stack, Tag, Text } from '@illog/ui'
import type { CategoryStats } from '../../utils/thisWeekStats'
import { formatHoursDecimal } from '../../utils/thisWeekStats'

type Props = {
  category: CategoryStats
}

export const CategoryCard = ({ category }: Props) => {
  return (
    <Stack
      gap="200"
      px="400"
      py="400"
      backgroundColor="backgroundDefaultDefault"
      borderRadius="200"
      border="border"
      borderColor="borderDefaultDefault"
      borderStyle="solid"
      minWidth="180px"
    >
      <Inline gap="200" align="center">
        <Tag tag={{ id: category.tagId, name: category.tagName, color: category.tagColor }} />
        <Text textStyle="caption" color="textDefaultTertiary">
          {category.taskCount} tasks
        </Text>
      </Inline>
      <Stack gap="50">
        <Text textStyle="heading" color="textDefaultDefault">
          {formatHoursDecimal(category.totalMinutes)}
        </Text>
        <Text textStyle="caption" color="textDefaultTertiary">
          {category.percentage.toFixed(0)}% of total time
        </Text>
      </Stack>
    </Stack>
  )
}
