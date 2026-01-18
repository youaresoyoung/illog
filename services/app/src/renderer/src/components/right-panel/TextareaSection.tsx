import { useState, useMemo } from 'react'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'

import { Stack, Text } from '@illog/ui'
import { useAutoSaveNote } from '../../hooks/queries/useNoteQueries'
import { TaskNote } from '../../types'
import { NoteToolbar } from './NoteToolbar'
import { ToolbarStoreProvider } from '../../context/ToolbarStoreContext'
import { AutoSavePlugin, InitialContentPlugin, ToolbarPlugin } from '../NoteEditor/plugins'
import { createEditorConfig } from '../../constant/editor'
import { validateUrl } from '../../utils/validation'
import './textarea-section.css'

type TextareaSectionProps = {
  taskId: string
  note: TaskNote | null
}

export const TextareaSection = ({ taskId, note }: TextareaSectionProps) => {
  const { mutate: saveNote } = useAutoSaveNote()
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)

  const initialConfig = useMemo(() => createEditorConfig(), [])

  const handleAnchorRef = (element: HTMLDivElement) => {
    if (element) {
      setAnchorElement(element)
    }
  }

  return (
    <Stack
      borderRadius="200"
      borderColor="borderDefaultDefault"
      borderStyle="solid"
      borderWidth="border"
      backgroundColor="backgroundDefaultDefault"
      overflow="hidden"
    >
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarStoreProvider>
          <NoteToolbar anchorElement={anchorElement} />
          <ToolbarPlugin />
        </ToolbarStoreProvider>

        <Stack position="relative" p="300" minHeight="400px">
          <RichTextPlugin
            contentEditable={
              <div ref={handleAnchorRef}>
                <ContentEditable style={{ minHeight: '360px', outline: 'none' }} className="md" />
              </div>
            }
            placeholder={<EditorPlaceholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </Stack>

        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin validateUrl={validateUrl} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <AutoSavePlugin taskId={taskId} saveNote={saveNote} />
        {note?.content && <InitialContentPlugin content={note.content} />}
      </LexicalComposer>
    </Stack>
  )
}

function EditorPlaceholder() {
  return (
    <Text
      textStyle="bodySmall"
      color="textDisabledDefault"
      position="absolute"
      top="12px"
      left="12px"
    >
      Start typing your notes here...
    </Text>
  )
}
