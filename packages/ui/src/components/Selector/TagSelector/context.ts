import { createContext, useContext, RefObject } from 'react'
import { OmittedTag, TagColor, TagType } from '../../Tag/types'

export type TagSelectorContextValue = {
  isOpen: boolean
  searchTerm: string
  selectedTags: TagType[]
  filteredTags: TagType[]
  canCreateNew: boolean
  previewColor: TagColor

  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLInputElement | null>

  setIsOpen: (open: boolean) => void
  setSearchTerm: (term: string) => void
  selectTag: (tag: TagType) => Promise<void>
  removeTag: (tagId: string) => Promise<void>
  createTag: () => Promise<void>
  deleteTag: (tagId: string) => Promise<void>
  updateTag: (tagId: string, data: Partial<OmittedTag>) => Promise<void>
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const TagSelectorContext = createContext<TagSelectorContextValue | null>(null)

export const useTagSelectorContext = () => {
  const context = useContext(TagSelectorContext)
  if (!context) {
    throw new Error('useTagSelectorContext must be used within TagSelector.Root')
  }
  return context
}
