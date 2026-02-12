import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  $addUpdateTag,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  SKIP_SELECTION_FOCUS_TAG
} from 'lexical'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from '@lexical/list'
import { $createCodeNode } from '@lexical/code'

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createParagraphNode())
  })
}

export const formatHeading = (editor: LexicalEditor, headingSize: HeadingTagType) => {
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createHeadingNode(headingSize))
  })
}

/**
 * Toggle bullet list - if current block is already bullet, convert to paragraph
 * @param editor - Lexical editor instance
 * @param currentBlockType - Current block type from toolbar state
 */
export const formatBulletList = (editor: LexicalEditor, currentBlockType: string) => {
  if (currentBlockType === 'bullet') {
    formatParagraph(editor)
  } else {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
  }
}

/**
 * Toggle check list - if current block is already check, convert to paragraph
 */
export const formatCheckList = (editor: LexicalEditor, currentBlockType: string) => {
  if (currentBlockType === 'check') {
    formatParagraph(editor)
  } else {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
  }
}

/**
 * Toggle quote - if current block is already quote, convert to paragraph
 */
export const formatQuote = (editor: LexicalEditor, currentBlockType: string) => {
  if (currentBlockType === 'quote') {
    formatParagraph(editor)
  } else {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
      const selection = $getSelection()
      $setBlocksType(selection, () => $createQuoteNode())
    })
  }
}

/**
 * Toggle code block - if current block is already code, convert to paragraph
 */
export const formatCode = (editor: LexicalEditor, currentBlockType: string) => {
  if (currentBlockType === 'code') {
    formatParagraph(editor)
  } else {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
      const selection = $getSelection()
      if (!selection) {
        return
      }
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode())
      } else {
        const textContent = selection.getTextContent()
        const codeNode = $createCodeNode()
        selection.insertNodes([codeNode])
        const newSelection = $getSelection()
        if ($isRangeSelection(newSelection)) {
          newSelection.insertRawText(textContent)
        }
      }
    })
  }
}

/**
 * Toggle numbered list - if current block is already numbered, convert to paragraph
 */
export const formatNumberedList = (editor: LexicalEditor, currentBlockType: string) => {
  if (currentBlockType === 'number') {
    formatParagraph(editor)
  } else {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
  }
}
