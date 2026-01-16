import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, $isRootOrShadowRoot } from 'lexical'
import { $isListNode, ListNode } from '@lexical/list'
import { $isHeadingNode } from '@lexical/rich-text'
import { $isCodeNode } from '@lexical/code'
import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils'

import { useToolbarStore } from '../../../context/ToolbarStoreContext'
import { blockTypeToBlockName } from '../../../stores/useEditorStore'

type BlockType = keyof typeof blockTypeToBlockName

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const updateToolbarState = useToolbarStore((state) => state.updateToolbarState)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) {
          return
        }

        const anchorNode = selection.anchor.getNode()
        let element =
          anchorNode.getKey() === 'root'
            ? anchorNode
            : $findMatchingParent(anchorNode, (e) => {
                const parent = e.getParent()
                return parent !== null && $isRootOrShadowRoot(parent)
              })

        if (element === null) {
          element = anchorNode.getTopLevelElementOrThrow()
        }

        let blockType: BlockType = 'paragraph'

        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
          const type = parentList ? parentList.getListType() : element.getListType()

          if (type === 'bullet') {
            blockType = 'bullet'
          } else if (type === 'number') {
            blockType = 'number'
          } else if (type === 'check') {
            blockType = 'check'
          }
        } else if ($isHeadingNode(element)) {
          const tag = element.getTag()
          blockType = tag as BlockType
        } else if ($isCodeNode(element)) {
          blockType = 'code'
        } else {
          const type = element.getType()
          if (type === 'quote') {
            blockType = 'quote'
          } else {
            blockType = 'paragraph'
          }
        }

        updateToolbarState('blockType', blockType)

        // Detect text formatting (for future use)
        // const isBold = selection.hasFormat('bold')
        // const isItalic = selection.hasFormat('italic')
        // updateToolbarState('isBold', isBold)
        // updateToolbarState('isItalic', isItalic)
      })
    })
  }, [editor, updateToolbarState])

  return null
}
