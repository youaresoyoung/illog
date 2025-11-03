import { useEffect, useRef } from 'react'

import { $getRoot, EditorState } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { Stack, Text } from '@illog/ui'
import { useAutoSaveNote } from '../../hooks/queries/useNoteQueries'
import { TaskNote } from 'services/app/src/types'

type AutoSavePluginProps = {
  taskId: string
  saveNote: (data: { taskId: string; content: string; clientUpdatedAt: number }) => void
}

function AutoSavePlugin({ taskId, saveNote }: AutoSavePluginProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot()
      const textContent = root.getTextContent()

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        saveNote({
          taskId,
          content: textContent,
          clientUpdatedAt: Date.now()
        })
      }, 1000)
    })
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return <OnChangePlugin onChange={handleChange} />
}

type InitialContentPluginProps = {
  content: string
}

function InitialContentPlugin({ content }: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext()
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!isInitialized.current && content) {
      editor.update(() => {
        const root = $getRoot()
        root.clear()
        const paragraph = root.getFirstChild()
        if (paragraph) {
          paragraph.remove()
        }
        root.selectEnd()
        const selection = root.select()
        if (selection) {
          selection.insertText(content)
        }
      })
      isInitialized.current = true
    }
  }, [editor, content])

  return null
}

type TextareaSectionProps = {
  taskId: string
  note: TaskNote | null
}

export const TextareaSection = ({ taskId, note }: TextareaSectionProps) => {
  const { mutate: saveNote } = useAutoSaveNote()

  const initialConfig = {
    namespace: 'NoteEditor',
    onError: (error: Error) => {
      console.error('Lexical Error:', error)
    },
    editorState: note?.content || undefined
  }

  return (
    <Stack
      borderRadius="200"
      borderColor="borderDefaultDefault"
      borderStyle="solid"
      borderWidth="border"
      backgroundColor="backgroundDefaultDefault"
      p="300"
      minHeight="400px"
      overflow="auto"
    >
      <LexicalComposer initialConfig={initialConfig}>
        <Text as="div" position="relative" textStyle="bodyBase">
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  minHeight: '360px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            }
            placeholder={
              <Text
                textStyle="bodyBase"
                color="textDisabledDefault"
                position="absolute"
                top="0"
                left="0"
              >
                Start typing your notes here...
              </Text>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </Text>
        <HistoryPlugin />
        <AutoSavePlugin taskId={taskId} saveNote={saveNote} />
        {note?.content && <InitialContentPlugin content={note.content} />}
      </LexicalComposer>
    </Stack>
  )
}
