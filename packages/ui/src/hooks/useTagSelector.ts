import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { OmittedTag, TagType } from '../components/Tag/types'

type Props = {
  tags: TagType[]
  defaultSelectedTags: TagType[]
  addTagToTask: (tagId: string) => Promise<void>
  createTag: (tag: Partial<OmittedTag>) => Promise<string>
  removeTagFromTask: (tagId: string) => Promise<void>
  maxTagLength: number
}

export const useTagSelector = ({
  tags,
  defaultSelectedTags,
  addTagToTask,
  createTag,
  removeTagFromTask,
  maxTagLength
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredTags = tags.filter(
    (tag) =>
      !defaultSelectedTags.includes(tag) &&
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const canCreateNew =
    Boolean(searchTerm.trim()) &&
    searchTerm.length <= maxTagLength &&
    !tags.some((tag) => tag.name.toLowerCase() === searchTerm.toLowerCase())

  const handleTagSelect = async (tag: TagType) => {
    if (!defaultSelectedTags.includes(tag)) {
      await addTagToTask(tag.id)
    }
    setSearchTerm('')
    inputRef.current?.focus()
  }

  const handleRemoveTagFromTask = async (tagId: string) => {
    await removeTagFromTask(tagId)
  }

  const handleCreateTag = async () => {
    if (!canCreateNew) return
    const createTagId = await createTag({ name: searchTerm.trim() })
    addTagToTask(createTagId)
    setSearchTerm('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canCreateNew) {
      e.preventDefault()
      handleCreateTag()
    } else if (e.key === 'Backspace' && !searchTerm && defaultSelectedTags.length > 0) {
      handleRemoveTagFromTask(defaultSelectedTags[defaultSelectedTags.length - 1].id)
    } else if (e.key === 'Escape') {
      setSearchTerm('')
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    defaultSelectedTags,
    filteredTags,
    canCreateNew,
    inputRef,
    containerRef,
    handleTagSelect,
    handleRemoveTagFromTask,
    handleCreateTag,
    handleKeyDown
  }
}
