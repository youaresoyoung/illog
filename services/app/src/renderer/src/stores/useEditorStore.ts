import { ElementFormatType } from 'lexical'
import { create } from 'zustand'

export const default_font_size = 12

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote'
}

const INITIAL_TOOLBAR_STATE = {
  blockType: 'paragraph' as keyof typeof blockTypeToBlockName,
  canRedo: false,
  canUndo: false,
  elementFormat: 'left' as ElementFormatType,
  fontColor: '#000',
  fontFamily: 'Arial',
  fontSize: `${default_font_size}px`,
  isBold: false,
  isCode: false,
  isHighlight: false,
  isItalic: false,
  isLink: false,
  isStrikethrough: false,
  isSubscript: false,
  isSuperscript: false,
  isUnderline: false,
  rootType: 'root' as const,
  listStartNumber: null as number | null
}

type ToolbarState = typeof INITIAL_TOOLBAR_STATE
type ToolbarStateKey = keyof ToolbarState
type ToolbarStateValue<Key extends ToolbarStateKey> = ToolbarState[Key]

export type ToolbarStore = ToolbarState & {
  updateToolbarState: <Key extends ToolbarStateKey>(key: Key, value: ToolbarStateValue<Key>) => void
  resetToolbarState: () => void
}

export const createToolbarStore = () => {
  return create<ToolbarStore>()((set) => ({
    ...INITIAL_TOOLBAR_STATE,

    updateToolbarState: (key, value) => {
      set(() => ({ [key]: value }) as Partial<ToolbarState>)
    },

    resetToolbarState: () => {
      set(INITIAL_TOOLBAR_STATE)
    }
  }))
}

export type ToolbarStoreApi = ReturnType<typeof createToolbarStore>
