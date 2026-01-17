import { BlockFormatDropDown } from '../NoteEditor/Toolbar/BlockFormatDropDown'
import { TextFormat } from '../NoteEditor/Toolbar/TextFormat'
import { Inline } from '@illog/ui'

export const NoteToolbar = () => {
  return (
    <Inline className="note-toolbar" gap="800">
      <BlockFormatDropDown />
      <TextFormat />
    </Inline>
  )
}
