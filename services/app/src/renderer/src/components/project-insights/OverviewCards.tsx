import { memo } from 'react'
import { Stack, Text, Box } from '@illog/ui'
import type { ProjectOverviewMetrics } from '../../utils/project-insights'
import { formatHoursDecimal } from '../../utils/this-week-stats'

type StatCardProps = {
  label: string
  value: string | number
}

const StatCard = memo(({ label, value }: StatCardProps) => (
  <Stack gap="200" px="600" borderRadius="200" align="center">
    <Text textStyle="heading" color="textDefaultDefault">
      {value}
    </Text>
    <Text textStyle="caption" color="textDefaultTertiary">
      {label}
    </Text>
  </Stack>
))

StatCard.displayName = 'StatCard'

type Props = {
  metrics: ProjectOverviewMetrics
}

export const OverviewCards = memo(({ metrics }: Props) => {
  const {
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    completionRate,
    totalMinutesSpent
  } = metrics

  return (
    <Stack gap="400">
      <Text textStyle="bodyStrong" color="textDefaultDefault">
        Project Overview
      </Text>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="800"
        bg="backgroundDefaultDefault"
        px="400"
        py="800"
        borderRadius="200"
      >
        <StatCard label="Total Tasks" value={totalTasks} />
        <StatCard label="Completed" value={completedTasks} />
        <StatCard label="In Progress" value={inProgressTasks} />
        <StatCard label="Todo" value={todoTasks} />
        <StatCard label="Completion Rate" value={`${completionRate.toFixed(1)}%`} />
        <StatCard label="Total Time Spent" value={formatHoursDecimal(totalMinutesSpent)} />
      </Box>
    </Stack>
  )
})

OverviewCards.displayName = 'OverviewCards'
