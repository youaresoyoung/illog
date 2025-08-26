import { useState } from 'react'
import { TagSelector } from './TagSelector'

export const TagSection = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddButtonClick = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div>
      <button onClick={handleAddButtonClick}>Add Tag</button>
      {isOpen && <TagSelector />}
    </div>
  )
}
