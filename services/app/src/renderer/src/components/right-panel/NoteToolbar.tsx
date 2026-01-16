import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { BlockFormatDropDown } from '../NoteEditor/Toolbar/BlockFormatDropDown'

export const NoteToolbar = () => {
  const [editor] = useLexicalComposerContext()

  return (
    <div className="note-toolbar">
      <BlockFormatDropDown editor={editor} />
    </div>
  )
}
