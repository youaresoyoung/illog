import { useEffect, useRef } from 'react'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { LinkNode } from '@lexical/link'
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown'

import { Button, Dialog, Stack, Text, useDialog } from '@illog/ui'
import { useReflection, useReflectionStream } from '../../hooks/queries/useNoteQueries'

type InitialContentPluginProps = {
  content: string
}

function InitialContentPlugin({ content }: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext()
  const previousContent = useRef<string>('')

  useEffect(() => {
    if (content && content !== previousContent.current) {
      editor.update(() => {
        $convertFromMarkdownString(content, TRANSFORMERS)
      })
      previousContent.current = content
    }
  }, [editor, content])

  useEffect(() => {
    editor.setEditable(false)
  }, [editor])

  return null
}

type TextareaSectionProps = {
  taskId: string
  noteContent?: string
}

export const ReflectionSection = ({ taskId, noteContent }: TextareaSectionProps) => {
  const { data: existingReflection } = useReflection(taskId)
  const { generateReflection, isStreaming, streamedContent, resetStream } = useReflectionStream()
  const [isDialogOpen, openDialog, closeDialog] = useDialog({ initialOpen: false })
  const displayReflectionText =
    isStreaming || streamedContent ? streamedContent : existingReflection?.content || ''

  const initialConfig = {
    namespace: 'ReflectionResult',
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, CodeHighlightNode, LinkNode],
    onError: (error: Error) => {
      console.error('Lexical Error:', error)
    },
    editorState: displayReflectionText || undefined
  }

  const startReflectionGeneration = async () => {
    if (!noteContent) return

    resetStream()
    await generateReflection(taskId, noteContent)
  }

  const handleReflectNote = async () => {
    if (existingReflection) {
      return openDialog()
    }

    startReflectionGeneration()
  }

  const handleConfirmClick = () => {
    closeDialog()
    startReflectionGeneration()
  }

  return (
    <>
      <Stack>
        <Button
          variant="primary"
          size="md"
          onClick={handleReflectNote}
          isDisabled={isStreaming || !noteContent}
        >
          {isStreaming ? 'Generating...' : 'Ask AI Reflection'}
        </Button>
        <Stack
          borderRadius="200"
          backgroundColor="backgroundDefaultSecondary"
          minHeight="240px"
          p="300"
          overflow="auto"
        >
          <LexicalComposer initialConfig={initialConfig}>
            <Text as="div" position="relative" textStyle="bodyBase">
              <InitialContentPlugin content={displayReflectionText} />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    style={{
                      outline: 'none',
                      minHeight: '240px',
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
                    No reflection generated yet...
                  </Text>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </Text>
          </LexicalComposer>
        </Stack>
      </Stack>

      <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
        <Dialog.Title>Do you want to delete the previous summary?</Dialog.Title>
        <Dialog.Description>
          To generate a new summary, the existing summary will be deleted.
        </Dialog.Description>
        <Dialog.Footer>
          <Button variant="secondary" isFullWidth onClick={closeDialog}>
            Cancel
          </Button>
          <Button variant="primary" isFullWidth onClick={handleConfirmClick}>
            Confirm
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}
