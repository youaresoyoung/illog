import { useState } from 'react'
import { Color } from 'services/app/src/types'
import { TagEditor } from './TagEditor'
import { useTaskActions } from '../../stores/useTaskStore'

type Props = {
  id: string
  name: string
  color: Color
  taskId: string
}

export const TagItem = ({ id, name, color, taskId }: Props) => {
  const { addTag } = useTaskActions()
  const [isEditMode, setIsEditMode] = useState(false)

  const handleClick = () => {
    addTag(taskId, id)
  }

  const handleEditButton = () => {
    setIsEditMode((prev) => !prev)
  }

  return (
    <li key={id} value={name} style={{ backgroundColor: color }} onClick={handleClick}>
      {name}
      <button onClick={handleEditButton}>Edit</button>
      {isEditMode && <TagEditor id={id} name={name} />}
    </li>
  )
}
