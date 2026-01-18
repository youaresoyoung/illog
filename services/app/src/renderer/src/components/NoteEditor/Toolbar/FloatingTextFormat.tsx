import { useCallback, useEffect, useRef, useState } from 'react'
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $isParagraphNode,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  getDOMSelection
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'

import { TextFormat } from './TextFormat'
import { Box, Portal } from '@illog/ui'
import {
  getDOMRangeRect,
  getSelectedNode,
  setFloatingElemPosition
} from '../../../utils/floating-format-position'

interface FloatingTextFormatProps {
  anchorElement: HTMLElement | null
}

export const FloatingTextFormat = ({ anchorElement }: FloatingTextFormatProps) => {
  const [editor] = useLexicalComposerContext()
  const floatingToolbarRef = useRef<HTMLDivElement | null>(null)
  const [isText, setIsText] = useState(false)

  const updateFloatingToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection()
      const nativeSelection = getDOMSelection(editor._window)
      const rootElement = editor.getRootElement()
      const floatingToolbarElem = floatingToolbarRef.current

      // 1. Check the validity of the selection
      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false)
        return
      }

      if (!$isRangeSelection(selection)) {
        setIsText(false)
        return
      }

      // 2. Check the type of the selected node
      const node = getSelectedNode(selection)
      const isTextNode = $isTextNode(node) || $isParagraphNode(node)

      if (!isTextNode) {
        setIsText(false)
        return
      }

      // 3. Check for empty text selection
      const rawTextContent = selection.getTextContent().replace(/\n/g, '')
      if (selection.isCollapsed() || rawTextContent === '') {
        setIsText(false)
        return
      }

      // 4. All conditions met → Show toolbar and update position
      setIsText(true)

      // 5. Calculate toolbar position (execute in the next frame)
      if (floatingToolbarElem && nativeSelection && !nativeSelection.isCollapsed && anchorElement) {
        requestAnimationFrame(() => {
          const rangeRect = getDOMRangeRect(nativeSelection, rootElement!)
          setFloatingElemPosition(rangeRect, floatingToolbarElem, anchorElement)
        })
      }
    })
  }, [editor, anchorElement])

  useEffect(() => {
    document.addEventListener('selectionchange', updateFloatingToolbar)
    return () => {
      document.removeEventListener('selectionchange', updateFloatingToolbar)
    }
  }, [updateFloatingToolbar])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updateFloatingToolbar()
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateFloatingToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false)
        }
      })
    )
  }, [editor, updateFloatingToolbar])

  if (!isText || !anchorElement) {
    return null
  }

  // TODO: Need to update UI
  return (
    <Portal container={anchorElement}>
      <Box
        ref={floatingToolbarRef}
        position="absolute"
        bg="backgroundDefaultDefault"
        rounded="100"
        p="100"
        top={0}
        left={0}
        opacity={0}
        willChange="transform"
        z={1000}
        boxShadow="200"
      >
        <TextFormat />
      </Box>
    </Portal>
  )
}
