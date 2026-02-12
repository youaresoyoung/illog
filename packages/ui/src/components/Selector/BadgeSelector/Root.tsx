import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { BadgeSelectorContext } from './context'
import { OmittedBadgeItem, BadgeColor, BadgeItem } from '../../Badge/types'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { pickRandomColor } from '../../../utils/color'

type RootProps = {
  children: ReactNode
  items: BadgeItem[]
  selectedItem: BadgeItem | null
  maxNameLength?: number
  onSelectItem: (itemId: string) => Promise<void>
  onClearItem: () => Promise<void>
  onCreateItem: (data: Partial<OmittedBadgeItem>) => Promise<string>
  onDeleteItem: (itemId: string) => Promise<void>
  onUpdateItem: (itemId: string, data: Partial<OmittedBadgeItem>) => Promise<void>
}

export const Root = ({
  children,
  items,
  selectedItem,
  maxNameLength = 100,
  onSelectItem,
  onClearItem,
  onCreateItem,
  onDeleteItem,
  onUpdateItem
}: RootProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [previewColor, setPreviewColor] = useState<BadgeColor>(
    () => pickRandomColor() as BadgeColor
  )

  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const normalizedSearch = searchTerm.toLowerCase()

  const filteredItems = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(normalizedSearch)),
    [items, normalizedSearch]
  )

  const canCreateNew = useMemo(() => {
    const trimmed = searchTerm.trim()
    if (!trimmed) return false
    if (trimmed.length > maxNameLength) return false
    const exists = items.some((item) => item.name.toLowerCase() === normalizedSearch)
    return !exists
  }, [searchTerm, maxNameLength, items, normalizedSearch])

  useClickOutside({
    refs: [triggerRef, contentRef],
    excludeSelectors: ['[data-badge-editor-root]'],
    onClickOutside: () => {
      setSearchTerm('')
      setIsOpen(false)
    },
    enabled: isOpen
  })

  const selectItem = useCallback(
    async (item: BadgeItem) => {
      await onSelectItem(item.id)
      setSearchTerm('')
      setIsOpen(false)
    },
    [onSelectItem]
  )

  const clearItem = useCallback(async () => {
    await onClearItem()
  }, [onClearItem])

  const createItem = useCallback(async () => {
    if (!canCreateNew) return
    const id = await onCreateItem({ name: searchTerm.trim(), color: previewColor })
    await onSelectItem(id)
    setSearchTerm('')
    setPreviewColor(pickRandomColor() as BadgeColor)
    setIsOpen(false)
  }, [canCreateNew, onCreateItem, onSelectItem, searchTerm, previewColor])

  const deleteItem = useCallback(
    async (itemId: string) => {
      await onDeleteItem(itemId)
      if (selectedItem?.id === itemId) {
        await onClearItem()
      }
    },
    [onDeleteItem, selectedItem, onClearItem]
  )

  const updateItem = useCallback(
    async (itemId: string, data: Partial<OmittedBadgeItem>) => {
      await onUpdateItem(itemId, data)
    },
    [onUpdateItem]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && canCreateNew) {
        e.preventDefault()
        void createItem()
      } else if (e.key === 'Backspace' && !searchTerm && selectedItem) {
        void clearItem()
      } else if (e.key === 'Escape') {
        setSearchTerm('')
        setIsOpen(false)
      }
    },
    [canCreateNew, createItem, searchTerm, selectedItem, clearItem]
  )

  const contextValue = useMemo(
    () => ({
      isOpen,
      searchTerm,
      selectedItem,
      filteredItems,
      canCreateNew,
      previewColor,
      triggerRef,
      contentRef,
      inputRef,
      setIsOpen,
      setSearchTerm,
      selectItem,
      clearItem,
      createItem,
      deleteItem,
      updateItem,
      handleKeyDown
    }),
    [
      isOpen,
      searchTerm,
      selectedItem,
      filteredItems,
      canCreateNew,
      previewColor,
      selectItem,
      clearItem,
      createItem,
      deleteItem,
      updateItem,
      handleKeyDown
    ]
  )

  return (
    <BadgeSelectorContext.Provider value={contextValue}>{children}</BadgeSelectorContext.Provider>
  )
}
