import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'

import { TaskWithTags } from 'services/app/src/types'
import { useTaskActions } from '../../stores/useTaskStore'
import { Tag, TagSelector } from '@illog/ui'
import { useTagActions, useTagState } from '../../stores/useTagStore'

export const TagSection = ({ task }: { task: TaskWithTags }) => {
  const { tags } = useTagState()
  const { createTag, updateTag, deleteTag } = useTagActions()
  const { addTag, removeTag } = useTaskActions()

  const tagsSectionRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [selectorPosition, setSelectorPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0
  })

  const filteredTags = useMemo(() => {
    return tags
  }, [tags])

  const handleAddTagToTask = async (tagId: string) => {
    await addTag(task.id, tagId)
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
    await removeTag(task.id, tagId)
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
        {task.tags.length > 0 ? (
          <ul style={{ display: 'flex', gap: '8px' }}>
            {task.tags.map((tag) => (
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
          defaultSelectedTags={task.tags}
          placeholder="Search tags..."
          position={selectorPosition}
          addTagToTask={handleAddTagToTask}
          removeTagFromTask={handleRemoveTagClick}
          createTag={createTag}
          deleteTag={deleteTag}
          updateTag={updateTag}
          closeTagSelector={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
