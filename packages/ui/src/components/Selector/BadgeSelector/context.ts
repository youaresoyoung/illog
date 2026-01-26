import { createContext, useContext, RefObject } from 'react'
import { OmittedBadgeItem, BadgeColor, BadgeItem } from '../../Badge/types'

export type BadgeSelectorContextValue = {
  isOpen: boolean
  searchTerm: string
  selectedItem: BadgeItem | null
  filteredItems: BadgeItem[]
  canCreateNew: boolean
  previewColor: BadgeColor

  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLInputElement | null>

  setIsOpen: (open: boolean) => void
  setSearchTerm: (term: string) => void
  selectItem: (item: BadgeItem) => Promise<void>
  clearItem: () => Promise<void>
  createItem: () => Promise<void>
  deleteItem: (itemId: string) => Promise<void>
  updateItem: (itemId: string, data: Partial<OmittedBadgeItem>) => Promise<void>
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const BadgeSelectorContext = createContext<BadgeSelectorContextValue | null>(null)

export const useBadgeSelectorContext = () => {
  const context = useContext(BadgeSelectorContext)
  if (!context) {
    throw new Error('useBadgeSelectorContext must be used within BadgeSelector.Root')
  }
  return context
}
