import React, { KeyboardEvent, useState } from 'react'
import * as style from '../editor.css'
import { backgroundColors } from 'packages/ui/src/core/tokens/generatedColors'
import { Divider } from '../../Divider'
import { Icon } from '../../Icon'
import { ProjectType, OmittedProject, ProjectColor } from '../../ProjectBadge'

const COLORS = [
  { name: 'Blue', value: 'blue', preview: backgroundColors.backgroundTagBlue },
  { name: 'Green', value: 'green', preview: backgroundColors.backgroundTagGreen },
  { name: 'Yellow', value: 'yellow', preview: backgroundColors.backgroundTagYellow },
  { name: 'Purple', value: 'purple', preview: backgroundColors.backgroundTagPurple },
  { name: 'Red', value: 'red', preview: backgroundColors.backgroundTagRed },
  { name: 'Gray', value: 'gray', preview: backgroundColors.backgroundTagGray }
]

type Props = {
  project: ProjectType
  onDelete: (projectId: string) => Promise<void>
  onChange: (projectId: string, contents: Partial<OmittedProject>) => Promise<void>
  onCloseEditor: () => void
}

export const ProjectEditor = ({ project, onDelete, onChange, onCloseEditor }: Props) => {
  const [currentProject, setCurrentProject] = useState({
    ...project
  })

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProject((prev) => ({ ...prev, name: e.target.value }))
    onChange(currentProject.id, { name: e.target.value, color: currentProject.color })
  }

  const handleColorChange = async (value: ProjectColor) => {
    setCurrentProject((prev) => ({ ...prev, color: value }))
    onChange(currentProject.id, { name: currentProject.name, color: value })
  }

  const handleDelete = async () => {
    onDelete(currentProject.id)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(currentProject.id, { name: currentProject.name, color: currentProject.color })
      onCloseEditor()
    }
  }

  return (
    <div className={style.editorContainer} data-project-editor-root>
      <input
        className={style.nameInput}
        value={currentProject.name}
        onChange={handleNameChange}
        placeholder="Project Name"
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
            onClick={() => handleColorChange(c.value as ProjectColor)}
          >
            <span className={style.colorPreview} style={{ background: c.preview }} />
            <span className={style.colorName}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
