import { useMemo, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Inline, Stack, Text, Icon, Button, ToggleMenu } from '@illog/ui'
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
import { useWeeklyParams } from '../hooks/useWeeklyParams'
import { QueryErrorState } from '../components/QueryState'
import { getStatsForFilterLevel, getLevelLabel } from '../utils/category-analytics'
import { useAnalyticsFilter } from '../hooks/useAnalyticsFilter'
import { useUIStore } from '../stores/useUIStore'
import { TaskViewMode } from '../types/nav'
import { WeeklyCalendarView } from '../components/calendar/WeeklyCalendarView'
import { TASK_VIEW_ITEMS } from '../constant/nav'

export const ThisWeek = () => {
  const [viewMode, setViewMode] = useState<TaskViewMode>('card')
  const openTaskNote = useUIStore((s) => s.openTaskNote)
  const { startTime, endTime, goToPreviousWeek, goToNextWeek, isCurrentWeek } = useWeeklyParams()

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch
  } = useTasksByFilters({
    startTime,
    endTime
  })

  // const weekId = getWeekId(new Date())
  const {
    filter,
    isLeaf,
    setViewMode: setAnalyticsViewMode,
    goBackToCategory,
    resetCategory,
    handleSegmentClick
  } = useAnalyticsFilter()

  const segments = useMemo(() => getStatsForFilterLevel(tasks, filter), [tasks, filter])
  const levelLabel = useMemo(() => getLevelLabel(filter), [filter])

  useEffect(() => {
    resetCategory()
  }, [startTime, resetCategory])

  const startDate = new Date(startTime)
  const endDate = new Date(endTime)
  const dateRangeLabel = `${format(startDate, 'MMMM d')} - ${format(endDate, 'd, yyyy')}`

  if (isLoading) {
    return (
      <div aria-busy="true">
        <ContentHeader title="Weekly Summary" />
        <Text>Loading...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <>
        <ContentHeader title="Weekly Summary" />
        <QueryErrorState error={error} onRetry={() => refetch()} />
      </>
    )
  }

  return (
    <Stack gap="800">
      <Stack gap="100">
        <ContentHeader
          title="Weekly Summary"
          actions={
            <ToggleMenu.Group>
              {TASK_VIEW_ITEMS.map((item, index) => (
                <ToggleMenu.Item
                  key={item.value}
                  item={item}
                  index={index}
                  value={viewMode}
                  onChange={(v) => setViewMode(v as TaskViewMode)}
                />
              ))}
            </ToggleMenu.Group>
          }
          button={
            <Inline gap="200" align="center">
              <Button variant="secondary" onClick={goToPreviousWeek} ariaLabel="Previous week">
                <Icon name="chevron_down" size="small" rotate={90} />
                Prev
              </Button>
              <Button
                variant="secondary"
                onClick={goToNextWeek}
                isDisabled={isCurrentWeek}
                ariaLabel="Next week"
              >
                Next
                <Icon name="chevron_down" size="small" rotate={-90} />
              </Button>
            </Inline>
          }
        />
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          {dateRangeLabel}
        </Text>
      </Stack>

      {viewMode === 'calendar' ? (
        <WeeklyCalendarView tasks={tasks} weekStart={startTime} onTaskClick={openTaskNote} />
      ) : (
        <>
          <StatsSummary tasks={tasks} weekStart={startTime} />

          <ViewModeSelector activeMode={filter.viewMode} onSelect={setAnalyticsViewMode} />

          <AnalyticsFilterBar
            filter={filter}
            onResetCategory={resetCategory}
            onGoBackToCategory={goBackToCategory}
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

          <DailyBreakdown tasks={tasks} weekStart={startTime} />
        </>
      )}

      {/* <WeeklyReflection weekId={weekId} /> */}
    </Stack>
  )
}
