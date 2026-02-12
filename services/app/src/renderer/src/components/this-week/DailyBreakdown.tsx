import { useMemo } from 'react'
import { Stack, Text } from '@illog/ui'
import { DaySection } from './DaySection'
import type { TaskWithTags } from '../../../../shared/types'
import { groupTasksByDay } from '../../utils/this-week-stats'

type Props = {
  tasks: TaskWithTags[]
  weekStart: string
}

export const DailyBreakdown = ({ tasks, weekStart }: Props) => {
  const days = useMemo(() => {
    return groupTasksByDay(tasks, new Date(weekStart))
  }, [tasks, weekStart])

  const daysWithTasks = days.filter((day) => day.tasks.length > 0)

  if (daysWithTasks.length === 0) {
    return (
      <Stack gap="400">
        <Text textStyle="bodyStrong" color="textDefaultDefault">
          Daily Breakdown
        </Text>
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          No tasks logged for this week
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
