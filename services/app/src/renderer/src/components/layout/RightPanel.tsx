import { useAutoSaveNote } from '../../hooks/useAutoSaveNote'
import { useTask, useUpdateTask } from '../../hooks/queries'
import { Input, TimePicker, useAutoSaveInput } from '@illog/ui'
import { TagSection } from '../tag/TagSection'

type Props = {
  taskId: string
}

export const RightPanel = ({ taskId }: Props) => {
  const { data: task } = useTask(taskId)
  const [note, handleChange] = useAutoSaveNote(taskId)

  const { mutate: updateTask } = useUpdateTask()

  const [title, , handleTitleChange] = useAutoSaveInput(
    task?.title || '',
    (value) => {
      if (task) updateTask({ id: task.id, contents: { title: value } })
    },
    1000
  )
  const [description, , handleDescriptionChange] = useAutoSaveInput(
    task?.description || '',
    (value) => {
      if (task) updateTask({ id: task.id, contents: { description: value } })
    },
    1000
  )

  if (!task) {
    // TODO: better error handling UX
    return <div>Loading...</div>
  }

  const handleDateTimeChange = (value: { start: string | null; end: string | null }) => {
    updateTask({
      id: task.id,
      contents: {
        timer_start: value.start ?? undefined,
        timer_end: value.end ?? undefined
      }
    })
  }

  return (
    <div
      style={{
        width: '594px',
        borderLeft: '1px solid #ccc',
        padding: '12px'
      }}
    >
      <Input value={title} onChange={handleTitleChange} />
      <Input value={description} onChange={handleDescriptionChange} />
      <div>
        <TagSection task={task} />
        <TimePicker
          value={{ start: task.timer_start ?? null, end: task.timer_end ?? null }}
          onChange={handleDateTimeChange}
        >
          <TimePicker.Range>
            <TimePicker.Input field="start" placeholder="Start time" />
            <TimePicker.Separator />
            <TimePicker.Input field="end" placeholder="End time" />
          </TimePicker.Range>
          <TimePicker.Summary showTime={false} />
        </TimePicker>
      </div>
      <textarea
        placeholder="Type your notes here..."
        style={{ width: '100%', height: '100%' }}
        value={note?.content || ''}
        onChange={handleChange}
      />
    </div>
  )
}
