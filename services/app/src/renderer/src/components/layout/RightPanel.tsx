import { useAutoSaveNote } from '../../hooks/useAutoSaveNote'
import { useTaskState } from '../../stores/useTaskStore'

export const RightPanel = () => {
  const { currentTaskId } = useTaskState()
  const [note, handleChange] = useAutoSaveNote(currentTaskId)

  return (
    <div
      style={{
        width: '594px',
        borderLeft: '1px solid #ccc',
        padding: '12px'
      }}
    >
      <textarea
        placeholder="Type your notes here..."
        style={{ width: '100%', height: '100%' }}
        value={note?.content || ''}
        onChange={handleChange}
      />
    </div>
  )
}
