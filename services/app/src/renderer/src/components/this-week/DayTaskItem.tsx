import { format } from 'date-fns'
import { Inline, Stack, Text } from '@illog/ui'
import type { TaskWithTags } from '../../../../shared/types'
import { getTaskDurationMinutes, formatDuration } from '../../utils/thisWeekStats'

const TAG_COLORS: Record<string, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  red: '#ef4444',
  gray: '#6b7280'
}

type Props = {
  task: TaskWithTags
}

export const DayTaskItem = ({ task }: Props) => {
  const duration = getTaskDurationMinutes(task)
  const completedTime = task.doneAt ? format(new Date(task.doneAt), 'h:mm a') : null

  return (
    <Inline
      px="400"
      py="300"
      backgroundColor="backgroundDefaultDefault"
      borderRadius="200"
      justify="space-between"
      align="center"
    >
      <Stack gap="100">
        <Text textStyle="bodyBase" color="textDefaultDefault">
          {task.title || 'Untitled task'}
        </Text>
        <Inline gap="200" align="center">
          {task.tags.slice(0, 3).map((tag) => (
            <Inline key={tag.id} gap="100" align="center">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: TAG_COLORS[tag.color] || TAG_COLORS.gray
                }}
              />
              <Text textStyle="caption" color="textDefaultTertiary">
                {tag.name}
              </Text>
            </Inline>
          ))}
          {completedTime && (
            <Text textStyle="caption" color="textDefaultTertiary">
              Completed {completedTime}
            </Text>
          )}
        </Inline>
      </Stack>
      <Text textStyle="bodyStrong" color="textDefaultSecondary">
        {formatDuration(duration)}
      </Text>
    </Inline>
  )
}
