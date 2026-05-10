import { Inline, Text, TimePicker } from '@illog/ui'
import { useUpdateTask } from '../../hooks/queries'
import { TaskWithTags } from '../../types'
import { formatDuration, getTaskDurationMinutes } from '../../utils/this-week-stats'

type Props = {
  task: TaskWithTags
}

export const Time = ({ task }: Props) => {
  const duration = getTaskDurationMinutes(task)
  const { mutate: updateTask } = useUpdateTask()

  const handleDateTimeChange = (value: { start: string | null; end: string | null }) => {
    if (!task) return

    updateTask({
      id: task.id,
      data: {
        startTime: value.start,
        endTime: value.end
      }
    })
  }

  return (
    <Inline gap="200" align="center">
      <TimePicker
        value={{
          start: task.startTime ? task.startTime.toISOString() : null,
          end: task.endTime ? task.endTime.toISOString() : null
        }}
        onChange={handleDateTimeChange}
      >
        <TimePicker.Range>
          <TimePicker.Input field="start" placeholder="Start time" />
          <TimePicker.Separator />
          <TimePicker.Input field="end" placeholder="End time" />
        </TimePicker.Range>
      </TimePicker>
      <Text textStyle="bodyStrong" color="textDefaultSecondary" whiteSpace="nowrap">
        {formatDuration(duration)}
      </Text>
    </Inline>
  )
}
