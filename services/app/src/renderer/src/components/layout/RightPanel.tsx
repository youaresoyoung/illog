import { useAutoSaveNote } from '../../hooks/useAutoSaveNote'
import { useReflection, useReflectionStream, useTask, useUpdateTask } from '../../hooks/queries'
import { Button, Input, TimePicker, useAutoSaveInput } from '@illog/ui'
import { TagSection } from '../tag/TagSection'

type Props = {
  taskId: string
}

export const RightPanel = ({ taskId }: Props) => {
  const { data: task } = useTask(taskId)
  const { data: existingReflection } = useReflection(taskId)
  const { generateReflection, isStreaming, streamedContent, resetStream } = useReflectionStream()
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

  const displayReflectionText =
    isStreaming || streamedContent ? streamedContent : existingReflection?.content || ''

  const handleDateTimeChange = (value: { start: string | null; end: string | null }) => {
    if (!task) return

    updateTask({
      id: task.id,
      contents: {
        timer_start: value.start ?? undefined,
        timer_end: value.end ?? undefined
      }
    })
  }

  const startReflectionGeneration = async () => {
    if (!note?.content) return

    resetStream()
    await generateReflection(taskId, note.content)
  }

  const handleReflectNote = async () => {
    if (existingReflection) {
      const shouldOverwrite = window.confirm(
        'An AI summary already exists. Do you want to overwrite it?'
      )
      if (!shouldOverwrite) return
      startReflectionGeneration()
    } else {
      startReflectionGeneration()
    }
  }

  if (!task) {
    // TODO: better error handling UX
    return <div>Loading...</div>
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
      <Button
        variant="primary"
        size="md"
        onClick={handleReflectNote}
        isDisabled={isStreaming || !note?.content}
      >
        {isStreaming ? 'Generating...' : 'AI Reflection'}
      </Button>
      <textarea
        placeholder="Type your notes here..."
        style={{ width: '100%', height: '400px' }}
        value={note?.content || ''}
        onChange={handleChange}
      />
      <div>
        <h4>AI Reflection</h4>
        <p>{displayReflectionText}</p>
      </div>
    </div>
  )
}
