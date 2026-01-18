import { useCallback, useState } from 'react'
import { EditorState } from 'lexical'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useAutoSave } from '@illog/ui'

const AUTO_SAVE_DEBOUNCE_MS = 1000

type AutoSavePluginProps = {
  taskId: string
  saveNote: (data: { taskId: string; content: string; clientUpdatedAt: number }) => void
}

export function AutoSavePlugin({ taskId, saveNote }: AutoSavePluginProps) {
  const [editorContent, setEditorContent] = useState<string>('')

  const handleChange = useCallback((editorState: EditorState) => {
    const jsonString = JSON.stringify(editorState.toJSON())
    setEditorContent(jsonString)
  }, [])

  const handleSave = useCallback(
    (content: string) => {
      saveNote({
        taskId,
        content,
        clientUpdatedAt: Date.now()
      })
    },
    [taskId, saveNote]
  )

  useAutoSave(editorContent, handleSave, AUTO_SAVE_DEBOUNCE_MS)

  return <OnChangePlugin onChange={handleChange} />
}
