import React, { useState } from 'react'
import { Icon } from '../Icon'
import * as style from './tagEditor.css'
import { backgroundColors } from '../../core/tokens/generatedColors'
import { Divider } from '../Divider'

const COLORS = [
  { name: 'Blue', value: 'blue', preview: backgroundColors.backgroundTagBlue },
  { name: 'Green', value: 'green', preview: backgroundColors.backgroundTagGreen },
  { name: 'Yellow', value: 'yellow', preview: backgroundColors.backgroundTagYellow },
  { name: 'Purple', value: 'purple', preview: backgroundColors.backgroundTagPurple },
  { name: 'Red', value: 'red', preview: backgroundColors.backgroundTagRed },
  { name: 'Gray', value: 'gray', preview: backgroundColors.backgroundTagGray }
]

type Props = {
  name?: string
  color?: string
  onDelete?: () => void
  onChange?: (name: string, color: string) => void
}

export const TagEditor = ({ name = '', color = 'blue', onDelete, onChange }: Props) => {
  const [tagName, setTagName] = useState(name)
  const [tagColor, setTagColor] = useState(color)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(e.target.value)
    onChange?.(e.target.value, tagColor)
  }
  const handleColorChange = (value: string) => {
    setTagColor(value)
    onChange?.(tagName, value)
  }

  return (
    <div className={style.editorContainer}>
      <input
        className={style.nameInput}
        value={tagName}
        onChange={handleNameChange}
        placeholder="Tag Name"
      />
      <div className={style.deleteRow}>
        <button className={style.deleteButton} onClick={onDelete}>
          <Icon name="trash" />
          <span>Delete</span>
        </button>
      </div>
      <Divider />
      <div className={style.colorList}>
        {COLORS.map((c) => (
          <div key={c.value} className={style.colorItem} onClick={() => handleColorChange(c.value)}>
            <span className={style.colorPreview} style={{ background: c.preview }} />
            <span className={style.colorName}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
