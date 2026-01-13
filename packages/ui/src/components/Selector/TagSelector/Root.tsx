import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { TagSelectorContext } from './context'
import { OmittedTag, TagColor, TagType } from '../../Tag/types'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { pickRandomColor } from '../../../utils/color'

type RootProps = {
  children: ReactNode
  tags: TagType[]
  selectedTags: TagType[]
  maxTagLength?: number
  onAddTag: (tagId: string) => Promise<void>
  onRemoveTag: (tagId: string) => Promise<void>
  onCreateTag: (data: Partial<OmittedTag>) => Promise<string>
  onDeleteTag: (tagId: string) => Promise<void>
  onUpdateTag: (tagId: string, data: Partial<OmittedTag>) => Promise<void>
}

export const Root = ({
  children,
  tags,
  selectedTags: defaultSelectedTags,
  maxTagLength = 100,
  onAddTag,
  onRemoveTag,
  onCreateTag,
  onDeleteTag,
  onUpdateTag
}: RootProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [previewColor, setPreviewColor] = useState<TagColor>(() => pickRandomColor() as TagColor)

  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const normalizedSearch = searchTerm.toLowerCase()
  const selectedTagIds = useMemo(
    () => new Set(defaultSelectedTags.map((t) => t.id)),
    [defaultSelectedTags]
  )

  const selectedTags = useMemo(
    () => defaultSelectedTags.map((t) => tags.find((it) => it.id === t.id) ?? t),
    [defaultSelectedTags, tags]
  )

  const filteredTags = useMemo(
    () => tags.filter((tag) => tag.name.toLowerCase().includes(normalizedSearch)),
    [tags, normalizedSearch]
  )

  const canCreateNew = useMemo(() => {
    const trimmed = searchTerm.trim()
    if (!trimmed) return false
    if (trimmed.length > maxTagLength) return false
    const exists = tags.some((tag) => tag.name.toLowerCase() === normalizedSearch)
    return !exists
  }, [searchTerm, maxTagLength, tags, normalizedSearch])

  // 바깥 클릭 감지
  useClickOutside({
    refs: [triggerRef, contentRef],
    excludeSelectors: ['[data-tag-editor-root]'],
    onClickOutside: () => {
      setSearchTerm('')
      setIsOpen(false)
    },
    enabled: isOpen
  })

  const selectTag = useCallback(
    async (tag: TagType) => {
      if (!selectedTagIds.has(tag.id)) {
        await onAddTag(tag.id)
      }
      setSearchTerm('')
      inputRef.current?.focus()
    },
    [onAddTag, selectedTagIds]
  )

  const removeTag = useCallback(
    async (tagId: string) => {
      await onRemoveTag(tagId)
    },
    [onRemoveTag]
  )

  const createTag = useCallback(async () => {
    if (!canCreateNew) return
    const id = await onCreateTag({ name: searchTerm.trim(), color: previewColor })
    await onAddTag(id)
    setSearchTerm('')
    setPreviewColor(pickRandomColor() as TagColor)
    inputRef.current?.focus()
  }, [canCreateNew, onCreateTag, onAddTag, searchTerm, previewColor])

  const deleteTag = useCallback(
    async (tagId: string) => {
      await onDeleteTag(tagId)
      await onRemoveTag(tagId)
    },
    [onDeleteTag, onRemoveTag]
  )

  const updateTag = useCallback(
    async (tagId: string, data: Partial<OmittedTag>) => {
      await onUpdateTag(tagId, data)
    },
    [onUpdateTag]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && canCreateNew) {
        e.preventDefault()
        void createTag()
      } else if (e.key === 'Backspace' && !searchTerm && defaultSelectedTags.length > 0) {
        void removeTag(defaultSelectedTags[defaultSelectedTags.length - 1].id)
      } else if (e.key === 'Escape') {
        setSearchTerm('')
      }
    },
    [canCreateNew, createTag, searchTerm, defaultSelectedTags, removeTag]
  )

  const contextValue = useMemo(
    () => ({
      isOpen,
      searchTerm,
      selectedTags,
      filteredTags,
      canCreateNew,
      previewColor,
      triggerRef,
      contentRef,
      inputRef,
      setIsOpen,
      setSearchTerm,
      selectTag,
      removeTag,
      createTag,
      deleteTag,
      updateTag,
      handleKeyDown
    }),
    [
      isOpen,
      searchTerm,
      selectedTags,
      filteredTags,
      canCreateNew,
      previewColor,
      selectTag,
      removeTag,
      createTag,
      deleteTag,
      updateTag,
      handleKeyDown
    ]
  )

  return <TagSelectorContext.Provider value={contextValue}>{children}</TagSelectorContext.Provider>
}
