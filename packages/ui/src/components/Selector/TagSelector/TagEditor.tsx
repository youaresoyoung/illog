import React, { KeyboardEvent, useState } from 'react'

import * as style from '../editor.css'
import { backgroundColors } from 'packages/ui/src/core/tokens/generatedColors'
import { Divider } from '../../Divider'
import { Icon } from '../../Icon'
import { TagType, OmittedTag, TagColor } from '../../Tag/types'

const COLORS = [
  { name: 'Blue', value: 'blue', preview: backgroundColors.backgroundTagBlue },
  { name: 'Green', value: 'green', preview: backgroundColors.backgroundTagGreen },
  { name: 'Yellow', value: 'yellow', preview: backgroundColors.backgroundTagYellow },
  { name: 'Purple', value: 'purple', preview: backgroundColors.backgroundTagPurple },
  { name: 'Red', value: 'red', preview: backgroundColors.backgroundTagRed },
  { name: 'Gray', value: 'gray', preview: backgroundColors.backgroundTagGray }
]

type Props = {
  tag: TagType
  onDelete: (tagId: string) => Promise<void>
  onChange: (tagId: string, contents: Partial<OmittedTag>) => Promise<void>
  onCloseEditor: () => void
}

export const TagEditor = ({ tag, onDelete, onChange, onCloseEditor }: Props) => {
  const [currentTag, setCurrentTag] = useState({
    ...tag
  })

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag((prev) => ({ ...prev, name: e.target.value }))
    onChange(currentTag.id, { name: e.target.value, color: currentTag.color })
  }

  const handleColorChange = async (value: TagColor) => {
    setCurrentTag((prev) => ({ ...prev, color: value }))
    onChange(currentTag.id, { name: currentTag.name, color: value })
  }

  const handleDelete = async () => {
    onDelete(currentTag.id)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(currentTag.id, { name: currentTag.name, color: currentTag.color })
      onCloseEditor()
    }
  }

  return (
    <div className={style.editorContainer} data-tag-editor-root>
      <input
        className={style.nameInput}
        value={currentTag.name}
        onChange={handleNameChange}
        placeholder="Tag Name"
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
            onClick={() => handleColorChange(c.value as TagColor)}
          >
            <span className={style.colorPreview} style={{ background: c.preview }} />
            <span className={style.colorName}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
