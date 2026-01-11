import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'

import { Inline, Stack, Tag, TagSelector, type TagType, type OmittedTag } from '@illog/ui'
import {
  useAllTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag
} from '../../hooks/queries/useTagQueries'
import { useAddTagToTask, useRemoveTagFromTask } from '../../hooks/queries/useTaskQueries'
import type { TaskWithTags, CreateTagRequest, UpdateTagRequest } from '../../../../shared/types'

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

  const filteredTags = useMemo(() => tags as TagType[], [tags])

  const syncedTaskTags = useMemo(
    () =>
      task.tags
        .map((tag) => tags.find((it) => it.id === tag.id))
        .filter((tag): tag is TagType => tag !== undefined),
    [task.tags, tags]
  )

  const handleAddTagToTask = async (tagId: string) => {
    try {
      await addTag({ taskId: task.id, tagId })
    } catch (error) {
      console.error('Failed to add tag to task:', error)
      throw error
    }
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

  // TODO: need to handle errors properly
  const handleRemoveTagClick = async (tagId: string) => {
    try {
      await removeTag({ taskId: task.id, tagId })
    } catch (error) {
      console.error('Failed to remove tag from task:', error)
      throw error
    }
  }

  const handleCreateTag = async (tag: Partial<OmittedTag>) => {
    try {
      if (!tag.name) throw new Error('Tag name is required')
      const newTag = await createTag({ name: tag.name, color: tag.color } as CreateTagRequest)
      return newTag.id
    } catch (error) {
      console.error('Failed to create tag:', error)
      throw error
    }
  }

  const handleUpdateTag = async (tagId: string, data: Partial<OmittedTag>) => {
    try {
      await updateTag({ id: tagId, data: data as UpdateTagRequest })
    } catch (error) {
      console.error('Failed to update tag:', error)
      throw error
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTag(tagId)
    } catch (error) {
      console.error('Failed to delete tag:', error)
      throw error
    }
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
      <Stack ref={tagsSectionRef} onClick={handleTagsSectionClick} minW="0" overflow="hidden">
        {syncedTaskTags.length > 0 ? (
          <Inline as="ul" role="list" gap="200" w="100%" wrap="wrap">
            {syncedTaskTags.map((tag) => (
              <Inline minW="0" maxW="100%" key={tag.id}>
                <Tag
                  tag={{ id: tag.id, name: tag.name, color: tag.color }}
                  removeFromTask={handleRemoveTagClick}
                />
              </Inline>
            ))}
          </Inline>
        ) : (
          <Tag
            tag={{ id: 'Add Tag', name: 'Add Tag', color: 'gray' }}
            openTagSelector={handleTagsSectionClick}
          />
        )}
      </Stack>
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
