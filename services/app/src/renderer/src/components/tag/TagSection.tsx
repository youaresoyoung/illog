import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'

import { Color, TaskWithTags } from 'services/app/src/types'
import { Tag, TagSelector } from '@illog/ui'
import {
  useAllTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag
} from '../../hooks/queries/useTagQueries'
import { useAddTagToTask, useRemoveTagFromTask } from '../../hooks/queries/useTaskQueries'

export const TagSection = ({ task }: { task: TaskWithTags }) => {
  const { data: tags = [] } = useAllTags()
  const { mutateAsync: createTag } = useCreateTag()
  const { mutateAsync: updateTag } = useUpdateTag()
  const { mutateAsync: deleteTag } = useDeleteTag()
  const { mutateAsync: addTag } = useAddTagToTask()
  const { mutateAsync: removeTag } = useRemoveTagFromTask()

  const tagsSectionRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [selectorPosition, setSelectorPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0
  })

  const filteredTags = useMemo(() => tags, [tags])

  const syncedTaskTags = useMemo(
    () => task.tags.map((t) => tags.find((it) => it.id === t.id) ?? t),
    [task.tags, tags]
  )

  const handleAddTagToTask = async (tagId: string) => {
    addTag({ taskId: task.id, tagId })
  }

  const handleTagsSectionClick = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation()
    if (!tagsSectionRef.current) return

    updateSelectorPosition()
    setIsOpen((prev) => !prev)
  }

  const updateSelectorPosition = () => {
    if (!tagsSectionRef.current) return

    const rect = tagsSectionRef.current.getBoundingClientRect()
    setSelectorPosition({
      top: rect.bottom + 8,
      left: rect.left
    })
  }

  const handleRemoveTagClick = async (tagId: string) => {
    removeTag({ taskId: task.id, tagId })
  }

  const handleCreateTag = async (tag: Partial<{ name: string; color: Color }>) => {
    const newTag = await createTag(tag)
    return newTag.id
  }

  const handleUpdateTag = async (
    tagId: string,
    contents: Partial<{ name: string; color: Color }>
  ) => {
    await updateTag({ id: tagId, contents })
  }

  const handleDeleteTag = async (tagId: string) => {
    await deleteTag(tagId)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleScroll = () => updateSelectorPosition()
    const handleResize = () => updateSelectorPosition()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  return (
    <>
      <div ref={tagsSectionRef} onClick={handleTagsSectionClick}>
        {syncedTaskTags.length > 0 ? (
          <ul style={{ display: 'flex', gap: '8px' }}>
            {syncedTaskTags.map((tag) => (
              <li key={tag.id}>
                <Tag
                  tag={{ id: tag.id, name: tag.name, color: tag.color }}
                  removeFromTask={handleRemoveTagClick}
                />
              </li>
            ))}
          </ul>
        ) : (
          <Tag
            tag={{ id: 'Add Tag', name: 'Add Tag', color: 'gray' }}
            openTagSelector={handleTagsSectionClick}
          />
        )}
      </div>
      {isOpen && (
        <TagSelector
          tags={filteredTags}
          defaultSelectedTags={syncedTaskTags}
          placeholder="Search tags..."
          position={selectorPosition}
          addTagToTask={handleAddTagToTask}
          removeTagFromTask={handleRemoveTagClick}
          createTag={handleCreateTag}
          deleteTag={handleDeleteTag}
          updateTag={handleUpdateTag}
          closeTagSelector={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
