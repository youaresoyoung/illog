import { Stack, Text, TimePicker } from '@illog/ui'
import { TaskWithTags } from '../../types'
import { useUpdateTask } from '../../hooks/queries'

export const TimeSection = ({ task }: { task: TaskWithTags }) => {
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
    <>
      <Text textStyle="bodyStrong">Time</Text>
      <Stack>
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
          <TimePicker.Summary showTime={false} />
        </TimePicker>
      </Stack>
    </>
  )
}
