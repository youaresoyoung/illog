import { BlockFormatDropDown } from '../NoteEditor/Toolbar/BlockFormatDropDown'
import { FloatingTextFormat } from '../NoteEditor/Toolbar/FloatingTextFormat'
import { TextFormat } from '../NoteEditor/Toolbar/TextFormat'
import { Inline } from '@illog/ui'

export const NoteToolbar = ({ anchorElement }: { anchorElement: HTMLElement | null }) => {
  return (
    <Inline className="note-toolbar" gap="800">
      <BlockFormatDropDown />
      <TextFormat />
      <FloatingTextFormat anchorElement={anchorElement} />
    </Inline>
  )
}
