import { Inline } from '@illog/ui'
import { StatCard } from './StatCard'
import type { TaskWithTags } from '../../../../shared/types'
import { calculateWeeklyStats, formatHoursDecimal } from '../../utils/thisWeekStats'

type Props = {
  tasks: TaskWithTags[]
}

export const StatsSummary = ({ tasks }: Props) => {
  const stats = calculateWeeklyStats(tasks)

  return (
    <Inline gap="400" wrap="wrap">
      <StatCard value={stats.completedCount} label="Tasks Completed" />
      <StatCard value={formatHoursDecimal(stats.totalMinutes)} label="Total Time Logged" />
      <StatCard value={stats.uniqueTagCount} label="Different Labels" />
      <StatCard value={stats.avgTasksPerDay.toFixed(1)} label="Avg Tasks/Day" />
    </Inline>
  )
}
