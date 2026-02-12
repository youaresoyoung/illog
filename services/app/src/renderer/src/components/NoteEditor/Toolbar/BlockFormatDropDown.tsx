import { blockTypeToBlockName } from '../../../stores/useEditorStore'
import { useToolbarStore } from '../../../context/ToolbarStoreContext'
import {
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote
} from '../../../utils/note-toolbar'
import { BasicSelector } from '@illog/ui'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type BlockTypeKey = keyof typeof blockTypeToBlockName

const BLOCK_TYPE_OPTIONS: BlockTypeKey[] = [
  'paragraph',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'number',
  'bullet',
  'check',
  'quote',
  'code'
]

export const BlockFormatDropDown = () => {
  const [editor] = useLexicalComposerContext()
  const blockType = useToolbarStore((state) => state.blockType)

  const handleBlockTypeChange = (newBlockType: string) => {
    const key = newBlockType as BlockTypeKey

    switch (key) {
      case 'paragraph':
        formatParagraph(editor)
        break
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        formatHeading(editor, key)
        break
      case 'bullet':
        formatBulletList(editor, blockType)
        break
      case 'number':
        formatNumberedList(editor, blockType)
        break
      case 'quote':
        formatQuote(editor, blockType)
        break
      case 'code':
        formatCode(editor, blockType)
        break
      case 'check':
        formatCheckList(editor, blockType)
        break
      default:
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Unknown block type: ${newBlockType}`)
        }
    }
  }

  return (
    <BasicSelector.Root value={blockType} onValueChange={handleBlockTypeChange}>
      <BasicSelector.Trigger>{blockTypeToBlockName[blockType]}</BasicSelector.Trigger>
      <BasicSelector.Content>
        <BasicSelector.Viewport>
          {BLOCK_TYPE_OPTIONS.map((key) => (
            <BasicSelector.Item key={key} value={key}>
              {blockTypeToBlockName[key]}
            </BasicSelector.Item>
          ))}
        </BasicSelector.Viewport>
      </BasicSelector.Content>
    </BasicSelector.Root>
  )
}
