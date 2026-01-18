import { useEffect, useRef } from 'react'
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type InitialContentPluginProps = {
  content: string
}

export function InitialContentPlugin({ content }: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext()
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!isInitialized.current && content) {
      editor.update(
        () => {
          const root = $getRoot()

          try {
            const parsedState = JSON.parse(content)
            if (parsedState.root) {
              const editorState = editor.parseEditorState(content)
              editor.setEditorState(editorState)
              isInitialized.current = true
              return
            }
          } catch {
            // TODO: Need to handle as plain text
          }

          root.clear()
          const lines = content.split('\n')
          lines.forEach((line) => {
            const paragraph = $createParagraphNode()
            if (line) {
              const textNode = $createTextNode(line)
              paragraph.append(textNode)
            }
            root.append(paragraph)
          })
        },
        { discrete: true }
      )
      isInitialized.current = true
    }
  }, [editor, content])

  return null
}
