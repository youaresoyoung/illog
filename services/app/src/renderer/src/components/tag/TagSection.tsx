import { MouseEvent, useMemo, useRef, useState } from 'react'

import { TaskWithTags } from 'services/app/src/types'
import { useTaskStore } from '../../stores/useTaskStore'
import { Tag, TagSelector } from '@illog/ui'
import { useTagStore } from '../../stores/useTagStore'

export const TagSection = ({ task }: { task: TaskWithTags }) => {
  const tags = useTagStore((s) => s.tags)
  const addTag = useTaskStore((s) => s.addTag)
  const createTag = useTagStore((s) => s.createTag)
  const removeTag = useTaskStore((s) => s.removeTag)

  const [isOpen, setIsOpen] = useState(false)
  const tagsSectionRef = useRef<HTMLDivElement>(null)
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

  const handleTagsSectionClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!tagsSectionRef.current) return

    const rect = tagsSectionRef.current.getBoundingClientRect()
    setSelectorPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX
    })

    setIsOpen((prev) => !prev)
  }

  const handleRemoveTagClick = async (tagId: string) => {
    await removeTag(task.id, tagId)
  }

  return (
    <>
      <div ref={tagsSectionRef} onClick={handleTagsSectionClick}>
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
      </div>
      {isOpen && (
        <TagSelector
          tags={filteredTags}
          defaultSelectedTags={task.tags}
          addTagToTask={handleAddTagToTask}
          createTag={createTag}
          removeTagFromTask={handleRemoveTagClick}
          placeholder="Search tags..."
          position={selectorPosition}
        />
      )}
    </>
  )
}
