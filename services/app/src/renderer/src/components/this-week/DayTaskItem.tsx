import { format } from 'date-fns'
import { Badge, Inline, Stack, Text } from '@illog/ui'
import type { TaskWithTags } from '../../../../shared/types'
import { getTaskDurationMinutes, formatDuration } from '../../utils/this-week-stats'

type Props = {
  task: TaskWithTags
}

// TODO: Remove after MVP
export const DayTaskItem = ({ task }: Props) => {
  const duration = getTaskDurationMinutes(task)
  const completedTime = task.doneAt ? format(new Date(task.doneAt), 'h:mm a') : null

  return (
    <Inline
      px="400"
      py="600"
      backgroundColor="backgroundDefaultDefault"
      borderRadius="200"
      justify="space-between"
      align="center"
      gap="400"
    >
      <Stack gap="600" minWidth={0} overflow="hidden" flex="1">
        <Text textStyle="bodyBase" color="textDefaultDefault" truncate="true">
          {task.title || 'Untitled task'}
        </Text>
        <Inline gap="200" overflow="hidden">
          {task.project && <Badge item={task.project} withoutIcon={true} />}
          {task.taskType && (
            <Inline gap="100" align="center" overflow="hidden">
              <Badge item={task.taskType} withoutIcon={true} />
              {task.taskSubtype && <Badge item={task.taskSubtype} withoutIcon={true} />}
            </Inline>
          )}
          {completedTime && (
            <Text textStyle="caption" color="textDefaultTertiary" whiteSpace="nowrap">
              Completed {completedTime}
            </Text>
          )}
        </Inline>
      </Stack>
      <Text textStyle="bodyStrong" color="textDefaultSecondary" whiteSpace="nowrap">
        {formatDuration(duration)}
      </Text>
    </Inline>
  )
}
