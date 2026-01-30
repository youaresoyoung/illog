import { Inline, Stack, Text } from '@illog/ui'
import { ProductivityCard } from './ProductivityCard'
import type { ChartSegment } from '../../utils/category-analytics'

type Props = {
  segments: ChartSegment[]
  title: string
  isLeaf: boolean
  onSegmentClick: (segment: ChartSegment) => void
}

export const Productivity = ({ segments, title, isLeaf, onSegmentClick }: Props) => {
  if (segments.length === 0) {
    return (
      <Stack gap="400">
        <Text textStyle="bodyStrong" color="textDefaultDefault">
          {title}
        </Text>
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          No data available
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="400">
      <Text textStyle="bodyStrong" color="textDefaultDefault">
        {title}
      </Text>
      <Inline gap="400" wrap="wrap">
        {segments.map((segment) => (
          <ProductivityCard
            key={segment.id}
            segment={segment}
            isClickable={!isLeaf}
            onClick={!isLeaf ? () => onSegmentClick(segment) : undefined}
          />
        ))}
      </Inline>
    </Stack>
  )
}
