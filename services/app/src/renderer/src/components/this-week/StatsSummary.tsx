import { Inline } from '@illog/ui'
import { StatItem } from './StatItem'
import type { TaskWithTags } from '../../../../shared/types'
import { calculateWeeklyStats, formatHoursDecimal } from '../../utils/this-week-stats'

type Props = {
  tasks: TaskWithTags[]
  weekStart?: string
}

export const StatsSummary = ({ tasks, weekStart }: Props) => {
  const stats = calculateWeeklyStats(tasks, weekStart ? new Date(weekStart) : undefined)

  return (
    <Inline
      gap="400"
      bg="backgroundDefaultDefault"
      px="400"
      py="800"
      borderRadius="200"
      justify="space-evenly"
    >
      <StatItem value={stats.completedCount} label="Tasks Completed" />
      <StatItem value={formatHoursDecimal(stats.totalMinutes)} label="Total Time Logged" />
      <StatItem value={stats.uniqueProjectCount} label="Projects" />
      <StatItem value={stats.avgTasksPerDay.toFixed(1)} label="Avg Tasks/Day" />
    </Inline>
  )
}
