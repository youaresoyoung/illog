import { format } from 'date-fns'
import { Inline, Stack, Text } from '@illog/ui'
import { ContentHeader } from '../components/layout/ContentHeader'
import {
  StatsSummary,
  ProductivityByCategory,
  TimeDistribution,
  DailyBreakdown,
  WeeklyReflection
} from '../components/this-week'
import { useTasksByFilters } from '../hooks/queries'
import { useThisWeekParams } from '../hooks/useThisWeekParams'
import { getWeekId } from '../utils/thisWeekStats'

export const ThisWeek = () => {
  const { startTime, endTime } = useThisWeekParams()

  const { data: tasks = [], isLoading } = useTasksByFilters({
    startTime,
    endTime
  })

  const weekId = getWeekId(new Date())

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
    <Stack gap="800" pb="1200">
      <Stack gap="100">
        <ContentHeader title="This Week's Summary" />
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          {dateRangeLabel}
        </Text>
      </Stack>

      <StatsSummary tasks={tasks} />

      <Inline gap="800" align="flex-start" wrap="wrap">
        <Stack flex="1" minWidth="300px">
          <ProductivityByCategory tasks={tasks} />
        </Stack>
        <Stack minWidth="280px">
          <TimeDistribution tasks={tasks} />
        </Stack>
      </Inline>

      <DailyBreakdown tasks={tasks} />

      <WeeklyReflection weekId={weekId} />
    </Stack>
  )
}
