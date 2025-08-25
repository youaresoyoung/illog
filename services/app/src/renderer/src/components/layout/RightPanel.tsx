import { ChangeEvent, useEffect, useState } from 'react'
import { useTaskStore } from '../../stores/taskStore'
import { TaskNote } from 'services/app/src/types'

export const RightPanel = () => {
  const currentTaskId = useTaskStore((state) => state.currentTaskId)
  const [note, setNote] = useState<TaskNote | null>(null)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNote((prev) => ({ ...prev, content: e.target.value }) as TaskNote)
  }

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (note?.content && currentTaskId) {
        const result = await window.api.note.autoSave(currentTaskId, note.content, Date.now())

        if (!result.conflict) {
          setNote({
            task_id: result.note.task_id,
            content: result.note.content,
            updated_at: result.note.updated_at
          })
        }
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [note?.content, currentTaskId])

  useEffect(() => {
    if (currentTaskId) {
      const getNote = async () => {
        const note = await window.api.note.findByTaskId(currentTaskId)
        setNote(note || null)
      }
      getNote()
    }
  }, [currentTaskId])

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
