import { useState } from 'react'
import { Button, Inline, Stack, Text } from '@illog/ui'
import { DayTaskItem } from './DayTaskItem'
import type { DayTasks } from '../../utils/thisWeekStats'
import { formatDuration } from '../../utils/thisWeekStats'

const INITIAL_VISIBLE_COUNT = 3

type Props = {
  day: DayTasks
}

export const DaySection = ({ day }: Props) => {
  const [expanded, setExpanded] = useState(false)

  const visibleTasks = expanded ? day.tasks : day.tasks.slice(0, INITIAL_VISIBLE_COUNT)
  const hiddenCount = day.tasks.length - INITIAL_VISIBLE_COUNT

  if (day.tasks.length === 0) {
    return null
  }

  return (
    <Stack gap="300">
      <Inline justify="space-between" align="center">
        <Text textStyle="bodyStrong" color="textDefaultDefault">
          {day.dayLabel}
        </Text>
        <Text textStyle="caption" color="textDefaultTertiary">
          {day.tasks.length} tasks • {formatDuration(day.totalMinutes)}
        </Text>
      </Inline>
      <Stack gap="200">
        {visibleTasks.map((task) => (
          <DayTaskItem key={task.id} task={task} />
        ))}
        {hiddenCount > 0 && !expanded && (
          <Button variant="secondary" onClick={() => setExpanded(true)}>
            +{hiddenCount} more tasks
          </Button>
        )}
        {expanded && hiddenCount > 0 && (
          <Button variant="secondary" onClick={() => setExpanded(false)}>
            Show less
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
