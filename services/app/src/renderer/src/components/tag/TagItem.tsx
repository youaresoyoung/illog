import { useState } from 'react'
import { Color } from 'services/app/src/types'
import { TagEditor } from './TagEditor'

type Props = {
  id: string
  name: string
  color: Color
}

export const TagItem = ({ id, name, color }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false)

  const handleEditButton = () => {
    setIsEditMode((prev) => !prev)
  }

  return (
    <li key={id} value={name} style={{ backgroundColor: color }}>
      {name}
      <button onClick={handleEditButton}>Edit</button>
      {isEditMode && <TagEditor id={id} name={name} />}
    </li>
  )
}
