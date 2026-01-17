import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { BlockFormatDropDown } from '../NoteEditor/Toolbar/BlockFormatDropDown'
import { TextFormat } from '../NoteEditor/Toolbar/TextFormat'
import { Inline } from '@illog/ui'

export const NoteToolbar = () => {
  const [editor] = useLexicalComposerContext()

  return (
    <Inline className="note-toolbar" gap="800">
      <BlockFormatDropDown editor={editor} />
      <TextFormat editor={editor} />
    </Inline>
  )
}
