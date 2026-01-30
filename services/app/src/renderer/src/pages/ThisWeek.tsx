import { useMemo } from 'react'
import { format } from 'date-fns'
import { Inline, Stack, Text } from '@illog/ui'
import { ContentHeader } from '../components/layout/ContentHeader'
import {
  StatsSummary,
  ViewModeSelector,
  Productivity,
  TimeDistribution,
  AnalyticsFilterBar,
  DailyBreakdown
} from '../components/this-week'
import { useTasksByFilters } from '../hooks/queries'
import { useThisWeekParams } from '../hooks/useThisWeekParams'
import {
  getFilteredTasks,
  getStatsForFilterLevel,
  getLevelLabel
} from '../utils/category-analytics'
import { useAnalyticsFilter } from '../hooks/useAnalyticsFilter'

export const ThisWeek = () => {
  const { startTime, endTime } = useThisWeekParams()

  const { data: tasks = [], isLoading } = useTasksByFilters({
    startTime,
    endTime
  })

  // const weekId = getWeekId(new Date())
  const { filter, isLeaf, setViewMode, goBackToDrill1, resetDrill, handleSegmentClick } =
    useAnalyticsFilter()

  const segments = useMemo(() => getStatsForFilterLevel(tasks, filter), [tasks, filter])
  const filteredTasks = useMemo(() => getFilteredTasks(tasks, filter), [tasks, filter])
  const levelLabel = useMemo(() => getLevelLabel(filter), [filter])

  const startDate = new Date(startTime)
  const endDate = new Date(endTime)
  const dateRangeLabel = `${format(startDate, 'MMMM d')} - ${format(endDate, 'd, yyyy')}`

  if (isLoading) {
    return (
      <>
        <ContentHeader title="This Week's Summary" />
        <Text>Loading...</Text>
      </>
    )
  }

  return (
    <Stack gap="800">
      <Stack gap="100">
        <ContentHeader title="This Week's Summary" />
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          {dateRangeLabel}
        </Text>
      </Stack>

      <StatsSummary tasks={tasks} />

      <ViewModeSelector activeMode={filter.viewMode} onSelect={setViewMode} />

      <AnalyticsFilterBar
        filter={filter}
        onResetDrill={resetDrill}
        onGoBackToDrill1={goBackToDrill1}
      />

      <Inline gap="600">
        <Stack flex="1">
          <Productivity
            segments={segments}
            title={levelLabel}
            isLeaf={isLeaf}
            onSegmentClick={handleSegmentClick}
          />
        </Stack>
        <Stack maxWidth={320} width={320}>
          <TimeDistribution
            segments={segments}
            isLeaf={isLeaf}
            onSegmentClick={handleSegmentClick}
          />
        </Stack>
      </Inline>

      <DailyBreakdown tasks={filteredTasks} />

      {/* <WeeklyReflection weekId={weekId} /> */}
    </Stack>
  )
}
