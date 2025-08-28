import { useState } from 'react'
import { TagSelector } from './TagSelector'
import { TaskWithTags } from 'services/app/src/types'
import { useTaskStore } from '../../stores/useTaskStore'

export const TagSection = ({ task }: { task: TaskWithTags }) => {
  const removeTag = useTaskStore((s) => s.removeTag)
  const [isOpen, setIsOpen] = useState(false)

  const handleAddButtonClick = () => {
    setIsOpen((prev) => !prev)
  }

  const handleRemoveTagClick = (tagId: string) => {
    removeTag(task.id, tagId)
  }

  return (
    <div>
      <ul>
        {task.tags.map((tag) => (
          <li key={tag.id}>
            {tag.name}
            <button onClick={() => handleRemoveTagClick(tag.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddButtonClick}>Add Tag</button>
      {isOpen && <TagSelector task={task} />}
    </div>
  )
}
