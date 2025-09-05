import { MouseEvent } from 'react'
import { Icon } from '../Icon'
import clsx from 'clsx'
import * as style from './tag.css'
import { textColors } from '../../core/tokens/generatedColors'
import { TagProps } from './types'

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getIconColor = (color: string) => {
  return `textTag${capitalize(color) as Capitalize<typeof color>}` as keyof typeof textColors
}

export const Tag = ({ tag, className, removeFromTask }: TagProps) => {
  const handleClickRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if ('id' in tag && tag.id) {
      removeFromTask?.(tag.id)
    }
  }

  return (
    <div className={clsx([style.tagRecipe({ color: tag.color }), className])}>
      <span>{tag.name}</span>
      {removeFromTask && (
        <button className={style.tagRemoveButton} onClick={handleClickRemove}>
          <Icon size="extraSmall" name="cancel" color={getIconColor(tag.color)} />
        </button>
      )}
    </div>
  )
}
