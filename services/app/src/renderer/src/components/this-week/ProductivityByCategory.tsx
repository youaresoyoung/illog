import { Inline, Stack, Text } from '@illog/ui'
import { CategoryCard } from './CategoryCard'
import type { TaskWithTags } from '../../../../shared/types'
import { calculateCategoryStats } from '../../utils/thisWeekStats'

type Props = {
  tasks: TaskWithTags[]
}

export const ProductivityByCategory = ({ tasks }: Props) => {
  const categories = calculateCategoryStats(tasks)

  if (categories.length === 0) {
    return (
      <Stack gap="400">
        <Text textStyle="bodyStrong" color="textDefaultDefault">
          Productivity by Category
        </Text>
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          No tagged tasks this week
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="400">
      <Text textStyle="bodyStrong" color="textDefaultDefault">
        Productivity by Category
      </Text>
      <Inline gap="400" wrap="wrap">
        {categories.map((category) => (
          <CategoryCard key={category.tagId} category={category} />
        ))}
      </Inline>
    </Stack>
  )
}
