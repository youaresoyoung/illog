import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { CommandPayloadType, FORMAT_TEXT_COMMAND } from 'lexical'
import { useToolbarStore } from '../../../context/ToolbarStoreContext'
import { Icon, IconNameOptions, Inline } from '@illog/ui'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type FormatType = CommandPayloadType<typeof FORMAT_TEXT_COMMAND>

interface FormatButtonProps {
  type: FormatType
  iconName: (typeof IconNameOptions)[number]
  isActive: boolean
  onClick: () => void
}

const FormatButton = ({ type, iconName, isActive, onClick }: FormatButtonProps) => {
  return (
    <Inline
      as="button"
      type="button"
      onClick={onClick}
      className={`format-button`}
      aria-label={`Format text as ${type}`}
      aria-pressed={isActive}
      p="150"
      rounded="200"
      _hover={{ bg: 'backgroundDefaultDefaultHover' }}
      _active={{ bg: 'backgroundDefaultDefaultHover' }}
      isActive={isActive}
    >
      <Icon name={iconName}></Icon>
    </Inline>
  )
}

export const TextFormat = () => {
  const [editor] = useLexicalComposerContext()
  const { isBold, isCode, isItalic, isStrikethrough, isSubscript, isSuperscript, isUnderline } =
    useToolbarStore(
      useShallow((s) => ({
        isBold: s.isBold,
        isCode: s.isCode,
        isItalic: s.isItalic,
        isStrikethrough: s.isStrikethrough,
        isSubscript: s.isSubscript,
        isSuperscript: s.isSuperscript,
        isUnderline: s.isUnderline
      }))
    )

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
    <Inline gap="200">
      <FormatButton
        type="bold"
        iconName="bold"
        isActive={isBold}
        onClick={() => handleFormat('bold')}
      />
      <FormatButton
        type="code"
        iconName="code"
        isActive={isCode}
        onClick={() => handleFormat('code')}
      />
      <FormatButton
        type="italic"
        iconName="italic"
        isActive={isItalic}
        onClick={() => handleFormat('italic')}
      />
      <FormatButton
        type="strikethrough"
        iconName="strikethrough"
        isActive={isStrikethrough}
        onClick={() => handleFormat('strikethrough')}
      />
      <FormatButton
        type="subscript"
        iconName="subscript"
        isActive={isSubscript}
        onClick={() => handleFormat('subscript')}
      />
      <FormatButton
        type="superscript"
        iconName="superscript"
        isActive={isSuperscript}
        onClick={() => handleFormat('superscript')}
      />
      <FormatButton
        type="underline"
        iconName="underline"
        isActive={isUnderline}
        onClick={() => handleFormat('underline')}
      />
    </Inline>
  )
}
