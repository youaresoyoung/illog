import { useAutoSaveNote } from '../../hooks/useAutoSaveNote'
import { useUIStoreState } from '../../stores/useUIStore'
import { useTask, useUpdateTask } from '../../hooks/queries'
import { Input, useAutoSaveInput } from '@illog/ui'
import { TagSection } from '../tag/TagSection'

export const RightPanel = () => {
  const { currentTaskId } = useUIStoreState()
  const { data: task } = useTask(currentTaskId!)
  const [note, handleChange] = useAutoSaveNote(currentTaskId)

  const { mutate: updateTask } = useUpdateTask()

  const [title, , handleTitleChange] = useAutoSaveInput(
    task?.title || '',
    (value) => updateTask({ id: task!.id, contents: { title: value } }),
    1000
  )
  const [description, , handleDescriptionChange] = useAutoSaveInput(
    task?.description || '',
    (value) => updateTask({ id: task!.id, contents: { description: value } }),
    1000
  )

  if (!task) {
    // TODO: better error handling UX
    return <div>Try refreshing the page</div>
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
      <TagSection task={task} />
      <textarea
        placeholder="Type your notes here..."
        style={{ width: '100%', height: '100%' }}
        value={note?.content || ''}
        onChange={handleChange}
      />
    </div>
  )
}
