import { useEffect, useRef } from 'react'

import { $createParagraphNode, $createTextNode, $getRoot, EditorState } from 'lexical'
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
      editor.update(
        () => {
          const root = $getRoot()
          root.clear()
          const paragraph = $createParagraphNode()
          const textNode = $createTextNode(content)
          paragraph.append(textNode)
          root.append(paragraph)
        },
        {
          discrete: true
        }
      )
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
    }
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
    >
      <LexicalComposer initialConfig={initialConfig}>
        <Stack position="relative">
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  minHeight: '360px'
                }}
                className="md"
              />
            }
            placeholder={
              <Text
                textStyle="bodySmall"
                color="textDisabledDefault"
                position="absolute"
                top="0.5em"
                left="0"
              >
                Start typing your notes here...
              </Text>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </Stack>
        <HistoryPlugin />
        <AutoSavePlugin taskId={taskId} saveNote={saveNote} />
        {note?.content && <InitialContentPlugin content={note.content} />}
      </LexicalComposer>
    </Stack>
  )
}
