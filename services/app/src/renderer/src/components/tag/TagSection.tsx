import { useState } from 'react'
import { TagSelector } from './TagSelector'
import { TaskWithTags } from 'services/app/src/types'

export const TagSection = ({ task }: { task: TaskWithTags }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddButtonClick = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div>
      <ul>
        {task.tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
      <button onClick={handleAddButtonClick}>Add Tag</button>
      {isOpen && <TagSelector task={task} />}
    </div>
  )
}
