import { memo, useMemo } from 'react'
import { Stack, Inline, Text, Badge, type BadgeColor } from '@illog/ui'
import type { TaskTypeMetrics } from '../../utils/project-insights'
import type { ChartSegment } from '../../utils/category-analytics'
import { formatDuration } from '../../utils/this-week-stats'
import { SortableMetricsTable, type ColumnDef } from './SortableMetricsTable'
import { TimeDistribution } from '../this-week'

type SortField = 'name' | 'count' | 'completionRate' | 'totalTime'

const COLUMNS: ColumnDef<TaskTypeMetrics, SortField>[] = [
  {
    field: 'name',
    header: 'Type',
    render: (m) => (
      <Badge item={{ name: m.name, color: m.color as BadgeColor }} withoutIcon={true} />
    )
  },
  {
    field: 'count',
    header: 'Count',
    render: (m) => m.count
  },
  {
    field: 'completionRate',
    header: 'Completion Rate',
    render: (m) => `${m.completionRate.toFixed(1)}%`
  },
  {
    field: 'totalTime',
    header: 'Total Time',
    render: (m) => (m.totalMinutes > 0 ? formatDuration(Math.round(m.totalMinutes)) : 'N/A')
  }
]

const getFieldValue = (item: TaskTypeMetrics, field: SortField): string | number => {
  switch (field) {
    case 'name':
      return item.name.toLowerCase()
    case 'count':
      return item.count
    case 'completionRate':
      return item.completionRate
    case 'totalTime':
      return item.totalMinutes
  }
}

type Props = {
  metrics: TaskTypeMetrics[]
}

export const TaskTypeAnalysis = memo(({ metrics }: Props) => {
  const chartSegments = useMemo<ChartSegment[]>(() => {
    const totalTime = metrics.reduce((sum, m) => sum + m.totalMinutes, 0)

    return metrics.map((m) => ({
      id: m.id,
      name: m.name,
      color: m.color,
      taskCount: m.count,
      totalMinutes: m.totalMinutes,
      percentage: totalTime > 0 ? (m.totalMinutes / totalTime) * 100 : 0
    }))
  }, [metrics])

  return (
    <Inline gap="600">
      <Stack gap="400">
        <Text textStyle="bodyStrong" color="textDefaultDefault">
          Task Type Performance
        </Text>
        <SortableMetricsTable
          data={metrics}
          columns={COLUMNS}
          defaultSortField="count"
          getFieldValue={getFieldValue}
          emptyMessage="No task types found"
        />
      </Stack>
      <TimeDistribution segments={chartSegments} />
    </Inline>
  )
})

TaskTypeAnalysis.displayName = 'TaskTypeAnalysis'
