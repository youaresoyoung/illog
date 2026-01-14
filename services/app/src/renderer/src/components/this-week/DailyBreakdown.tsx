import { useMemo } from 'react'
import { startOfWeek } from 'date-fns'
import { Stack, Text } from '@illog/ui'
import { DaySection } from './DaySection'
import type { TaskWithTags } from '../../../../shared/types'
import { groupTasksByDay } from '../../utils/thisWeekStats'

type Props = {
  tasks: TaskWithTags[]
}

export const DailyBreakdown = ({ tasks }: Props) => {
  const days = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    return groupTasksByDay(tasks, weekStart)
  }, [tasks])

  const daysWithTasks = days.filter((day) => day.tasks.length > 0)

  if (daysWithTasks.length === 0) {
    return (
      <Stack gap="400">
        <Text textStyle="bodyStrong" color="textDefaultDefault">
          Daily Breakdown
        </Text>
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          No tasks logged this week
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="600">
      <Text textStyle="bodyStrong" color="textDefaultDefault">
        Daily Breakdown
      </Text>
      <Stack gap="600">
        {daysWithTasks.map((day) => (
          <DaySection key={day.dayLabel} day={day} />
        ))}
      </Stack>
    </Stack>
  )
}
