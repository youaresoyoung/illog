import { useCallback } from 'react'
import { CommandPayloadType, FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical'
import { useToolbarStore } from '../../../context/ToolbarStoreContext'
import { ToolbarStore } from '../../../stores/useEditorStore'
import { Inline } from '@illog/ui'

type FormatType = CommandPayloadType<typeof FORMAT_TEXT_COMMAND>

interface FormatButtonProps {
  type: FormatType
  iconName: string
  isActive: boolean
  onClick: () => void
}

const FormatButton = ({ type, iconName, isActive, onClick }: FormatButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`format-button${isActive ? ' active' : ''}`}
      aria-label={`Format text as ${type}`}
      aria-pressed={isActive}
    >
      {iconName}
    </button>
  )
}

const formatStateSelector = (s: ToolbarStore) => ({
  isBold: s.isBold,
  isCode: s.isCode,
  isItalic: s.isItalic,
  isStrikethrough: s.isStrikethrough,
  isSubscript: s.isSubscript,
  isSuperscript: s.isSuperscript,
  isUnderline: s.isUnderline
})

export const TextFormat = ({ editor }: { editor: LexicalEditor }) => {
  const { isBold, isCode, isItalic, isStrikethrough, isSubscript, isSuperscript, isUnderline } =
    useToolbarStore(formatStateSelector)

  const handleFormat = useCallback(
    (formatType: FormatType) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType)
    },
    [editor]
  )

  if (!editor.isEditable()) {
    return null
  }

  return (
    <Inline gap="400">
      <FormatButton
        type="bold"
        iconName="B"
        isActive={isBold}
        onClick={() => handleFormat('bold')}
      />
      <FormatButton
        type="code"
        iconName="</>"
        isActive={isCode}
        onClick={() => handleFormat('code')}
      />
      <FormatButton
        type="italic"
        iconName="I"
        isActive={isItalic}
        onClick={() => handleFormat('italic')}
      />
      <FormatButton
        type="strikethrough"
        iconName="S"
        isActive={isStrikethrough}
        onClick={() => handleFormat('strikethrough')}
      />
      <FormatButton
        type="subscript"
        iconName="X₂"
        isActive={isSubscript}
        onClick={() => handleFormat('subscript')}
      />
      <FormatButton
        type="superscript"
        iconName="X²"
        isActive={isSuperscript}
        onClick={() => handleFormat('superscript')}
      />
      <FormatButton
        type="underline"
        iconName="U"
        isActive={isUnderline}
        onClick={() => handleFormat('underline')}
      />
    </Inline>
  )
}
