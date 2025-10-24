import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { OmittedTag, TagColor, TagType } from '../components/Tag/types'

type Props = {
  tags: TagType[]
  defaultSelectedTags: TagType[]
  maxTagLength: number
  addTagToTask: (tagId: string) => Promise<void>
  removeTagFromTask: (tagId: string) => Promise<void>
  createTag: (tag: Partial<OmittedTag>) => Promise<string>
  deleteTag: (tagId: string) => Promise<void>
  closeTagSelector: () => void
}

const pickRandomColor = (): TagColor => {
  const colors: TagColor[] = ['blue', 'gray', 'green', 'purple', 'red', 'yellow']
  return colors[Math.floor(Math.random() * colors.length)]
}

export const useTagSelector = ({
  tags,
  defaultSelectedTags,
  maxTagLength,
  addTagToTask,
  removeTagFromTask,
  createTag,
  deleteTag,
  closeTagSelector
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [previewColor, setPreviewColor] = useState<TagColor>(pickRandomColor)

  const containerRef = useRef<HTMLDivElement>(null)
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

  const handleTagSelect = useCallback(
    async (tag: TagType) => {
      if (!selectedTagIds.has(tag.id)) {
        await addTagToTask(tag.id)
      }
      setSearchTerm('')
      inputRef.current?.focus()
    },
    [addTagToTask, selectedTagIds]
  )

  const handleRemoveTagFromTask = useCallback(
    async (tagId: string) => {
      await removeTagFromTask(tagId)
    },
    [removeTagFromTask]
  )

  const handleCreateTag = useCallback(async () => {
    if (!canCreateNew) return
    const id = await createTag({ name: searchTerm.trim(), color: previewColor })
    await addTagToTask(id)
    setSearchTerm('')
    inputRef.current?.focus()
  }, [canCreateNew, createTag, addTagToTask, searchTerm, previewColor])

  const handleDeleteTag = useCallback(
    async (tagId: string) => {
      await deleteTag(tagId)
      await removeTagFromTask(tagId)
    },
    [deleteTag, removeTagFromTask]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && canCreateNew) {
        e.preventDefault()
        void handleCreateTag()
      } else if (e.key === 'Backspace' && !searchTerm && defaultSelectedTags.length > 0) {
        void handleRemoveTagFromTask(defaultSelectedTags[defaultSelectedTags.length - 1].id)
      } else if (e.key === 'Escape') {
        setSearchTerm('')
      }
    },
    [canCreateNew, handleCreateTag, searchTerm, defaultSelectedTags, handleRemoveTagFromTask]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const isInContainer = !!(
        containerRef.current &&
        target &&
        containerRef.current.contains(target)
      )
      const isInTagEditor = !!(
        target && (target.closest('[data-tag-editor-root]') as HTMLElement | null)
      )
      if (!isInContainer && !isInTagEditor) {
        setSearchTerm('')
        closeTagSelector()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeTagSelector])

  useEffect(() => {
    if (canCreateNew) {
      setPreviewColor(pickRandomColor())
    }
  }, [canCreateNew])

  return {
    searchTerm,
    setSearchTerm,
    defaultSelectedTags,
    selectedTags,
    filteredTags,
    canCreateNew,
    previewColor,
    inputRef,
    containerRef,
    handleTagSelect,
    handleRemoveTagFromTask,
    handleCreateTag,
    handleDeleteTag,
    handleKeyDown
  }
}
