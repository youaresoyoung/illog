import { memo, useMemo } from 'react'
import { Badge, type BadgeColor, Inline, Stack, Text } from '@illog/ui'
import type { SubtypeMetrics } from '../../utils/project-insights'
import { formatDuration } from '../../utils/this-week-stats'
import { TimeDistribution } from '../this-week'
import { SortableMetricsTable, type ColumnDef } from './SortableMetricsTable'

type SortField = 'name' | 'taskType' | 'count' | 'completionRate' | 'totalTime'

const COLUMNS: ColumnDef<SubtypeMetrics, SortField>[] = [
  {
    field: 'name',
    header: 'Subtype',
    render: (m) => (
      <Badge item={{ name: m.name, color: m.color as BadgeColor }} withoutIcon={true} />
    )
  },
  {
    field: 'taskType',
    header: 'Parent Type',
    render: (m) => (
      <Badge
        item={{ name: m.taskTypeName, color: m.taskTypeColor as BadgeColor }}
        withoutIcon={true}
      />
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
    render: (m) => formatDuration(m.totalMinutes)
  }
]

const getFieldValue = (item: SubtypeMetrics, field: SortField): string | number => {
  switch (field) {
    case 'name':
      return item.name.toLowerCase()
    case 'taskType':
      return item.taskTypeName.toLowerCase()
    case 'count':
      return item.count
    case 'completionRate':
      return item.completionRate
    case 'totalTime':
      return item.totalMinutes
  }
}

type Props = {
  metrics: SubtypeMetrics[]
}

export const SubtypeTable = memo(({ metrics }: Props) => {
  const chartSegments = useMemo(() => {
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
          Sub Type Deep Analysis
        </Text>
        <SortableMetricsTable
          data={metrics}
          columns={COLUMNS}
          defaultSortField="count"
          getFieldValue={getFieldValue}
          emptyMessage="No subtypes found"
        />
      </Stack>
      <TimeDistribution segments={chartSegments} />
    </Inline>
  )
})

SubtypeTable.displayName = 'SubtypeTable'
