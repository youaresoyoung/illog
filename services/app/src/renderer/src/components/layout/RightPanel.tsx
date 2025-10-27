import { useEffect } from 'react'
import { useAutoSaveNote } from '../../hooks/useAutoSaveNote'
import { useUIStoreState } from '../../stores/useUIStore'
import { useTask, useUpdateTask } from '../../hooks/queries'
import { Input, useAutoSaveInput } from '@illog/ui'

export const RightPanel = () => {
  const { currentTaskId } = useUIStoreState()
  const { data: task } = useTask(currentTaskId!)
  const [note, handleChange] = useAutoSaveNote(currentTaskId)

  const { mutate: updateTask } = useUpdateTask()
  const [title, setTitle, handleTitleChange] = useAutoSaveInput(
    task?.title || '',
    (value) => updateTask({ id: task!.id, contents: { title: value } }),
    1000
  )

  useEffect(() => {
    if (task?.title !== undefined) {
      setTitle(task.title)
    }
  }, [task?.title, setTitle])

  return (
    <div
      style={{
        width: '594px',
        borderLeft: '1px solid #ccc',
        padding: '12px'
      }}
    >
      <Input value={title} onChange={handleTitleChange} />
      <textarea
        placeholder="Type your notes here..."
        style={{ width: '100%', height: '100%' }}
        value={note?.content || ''}
        onChange={handleChange}
      />
    </div>
  )
}
