import { format } from 'date-fns'
import { Box, Inline, Stack, Text } from '@illog/ui'
import type { TaskWithTags } from '../../../../shared/types'
import { getTaskDurationMinutes, formatDuration } from '../../utils/this-week-stats'
import { DONUT_BACKGROUND_COLORS, DONUT_BORDER_COLORS } from '../../constant/color'

type Props = {
  task: TaskWithTags
}

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
    >
      <Stack gap="200">
        <Text textStyle="bodyBase" color="textDefaultDefault">
          {task.title || 'Untitled task'}
        </Text>
        <Inline gap="200" align="center">
          {task.project && (
            <Inline gap="100" align="center">
              <Box
                width={8}
                height={8}
                rounded="full"
                style={{
                  backgroundColor:
                    DONUT_BACKGROUND_COLORS[task.project.color] || DONUT_BACKGROUND_COLORS.gray,
                  border: `1px solid ${DONUT_BORDER_COLORS[task.project.color] || DONUT_BORDER_COLORS.gray}`
                }}
              />
              <Text textStyle="caption" color="textDefaultTertiary">
                {task.project.name}
              </Text>
            </Inline>
          )}
          {task.taskType && (
            <Text textStyle="caption" color="textDefaultTertiary">
              {task.taskType.name}
              {task.taskSubtype ? ` / ${task.taskSubtype.name}` : ''}
            </Text>
          )}
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
