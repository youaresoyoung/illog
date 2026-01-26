import React, { KeyboardEvent, useState } from 'react'
import * as style from '../editor.css'
import { backgroundColors } from 'packages/ui/src/core/tokens/generatedColors'
import { Divider } from '../../Divider'
import { Icon } from '../../Icon'
import { BadgeItem, OmittedBadgeItem, BadgeColor } from '../../Badge'

const COLORS = [
  { name: 'Blue', value: 'blue', preview: backgroundColors.backgroundTagBlue },
  { name: 'Green', value: 'green', preview: backgroundColors.backgroundTagGreen },
  { name: 'Yellow', value: 'yellow', preview: backgroundColors.backgroundTagYellow },
  { name: 'Purple', value: 'purple', preview: backgroundColors.backgroundTagPurple },
  { name: 'Red', value: 'red', preview: backgroundColors.backgroundTagRed },
  { name: 'Gray', value: 'gray', preview: backgroundColors.backgroundTagGray }
]

type Props = {
  item: BadgeItem
  onDelete: (itemId: string) => Promise<void>
  onChange: (itemId: string, contents: Partial<OmittedBadgeItem>) => Promise<void>
  onCloseEditor: () => void
}

export const BadgeEditor = ({ item, onDelete, onChange, onCloseEditor }: Props) => {
  const [currentItem, setCurrentItem] = useState({
    ...item
  })

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentItem((prev) => ({ ...prev, name: e.target.value }))
    onChange(currentItem.id, { name: e.target.value, color: currentItem.color })
  }

  const handleColorChange = async (value: BadgeColor) => {
    setCurrentItem((prev) => ({ ...prev, color: value }))
    onChange(currentItem.id, { name: currentItem.name, color: value })
  }

  const handleDelete = async () => {
    onDelete(currentItem.id)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(currentItem.id, { name: currentItem.name, color: currentItem.color })
      onCloseEditor()
    }
  }

  return (
    <div className={style.editorContainer} data-badge-editor-root>
      <input
        className={style.nameInput}
        value={currentItem.name}
        onChange={handleNameChange}
        placeholder="Name"
        onKeyDown={handleKeyDown}
      />
      <div className={style.deleteRow}>
        <button className={style.deleteButton} onClick={handleDelete}>
          <Icon name="trash" />
          <span>Delete</span>
        </button>
      </div>
      <Divider />
      <div className={style.colorList}>
        {COLORS.map((c) => (
          <div
            key={c.value}
            className={style.colorItem}
            onClick={() => handleColorChange(c.value as BadgeColor)}
          >
            <span className={style.colorPreview} style={{ background: c.preview }} />
            <span className={style.colorName}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
