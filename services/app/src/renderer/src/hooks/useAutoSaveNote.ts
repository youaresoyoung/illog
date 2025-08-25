import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { TaskNote } from 'services/app/src/types'

export const useAutoSaveNote = (
  currentTaskId: string | undefined
): [
  note: TaskNote | null,
  handleChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
] => {
  const [note, setNote] = useState<TaskNote | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = e.target
    setNote((prev) => ({ ...prev, content: value }) as TaskNote)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      if (currentTaskId) {
        try {
          const { conflict, note } = await window.api.note.autoSave(
            currentTaskId,
            value,
            Date.now()
          )
          if (!conflict) {
            const { task_id, content, updated_at } = note
            setNote({
              task_id: task_id,
              content: content,
              updated_at: updated_at
            })
          }
        } catch (e) {
          console.error(e)
        }
      }
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!currentTaskId) {
      setNote(null)
      return
    }

    let isMounted = true
    const loadNote = async () => {
      try {
        const note = await window.api.note.findByTaskId(currentTaskId)
        if (isMounted) {
          setNote(note)
        }
      } catch (e) {
        console.error(e)
      }
    }

    loadNote()

    return () => {
      isMounted = false
    }
  }, [currentTaskId])

  return [note, handleChange]
}
