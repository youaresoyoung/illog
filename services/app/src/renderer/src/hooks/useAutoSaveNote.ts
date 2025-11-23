import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { TaskNote } from 'services/app/src/types'
import { useTaskNote, useAutoSaveNote as useAutoSaveNoteMutation } from './queries/useNoteQueries'

export const useAutoSaveNote = (
  currentTaskId: string | undefined
): [
  note: TaskNote | null,
  handleChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
] => {
  const { data: fetchedNote } = useTaskNote(currentTaskId)
  const { mutate: saveNote } = useAutoSaveNoteMutation()

  const [localContent, setLocalContent] = useState<string>(() => fetchedNote?.content || '')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // NOTE: Since external data and local state synchronization is needed, useEffect is appropriate
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalContent(fetchedNote?.content || '')
  }, [currentTaskId, fetchedNote])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = e.target
    setLocalContent(value)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      if (currentTaskId) {
        saveNote({
          taskId: currentTaskId,
          content: value,
          clientUpdatedAt: Date.now()
        })
      }
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const note: TaskNote | null = fetchedNote
    ? { ...fetchedNote, content: localContent }
    : currentTaskId
      ? { task_id: currentTaskId, content: localContent, updated_at: new Date().toISOString() }
      : null

  return [note, handleChange]
}
