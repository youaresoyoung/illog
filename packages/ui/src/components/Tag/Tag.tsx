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

export const Tag = ({
  tag,
  className,
  isVisibleRemoveButton,
  openTagSelector,
  onRemove
}: TagProps) => {
  const handleClickRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if ('id' in tag && tag.id) {
      onRemove?.(tag.id)
    }
  }

  if (openTagSelector) {
    return (
      <button
        className={clsx([style.tagBase, style.tagAddButton, className])}
        onClick={openTagSelector}
      >
        <Icon size="extraSmall" name="plus" color={getIconColor(textColors.textDefaultSecondary)} />
        <span>{tag.name}</span>
      </button>
    )
  }

  return (
    <span className={clsx([style.tagRecipe({ color: tag.color }), className])}>
      {tag.name}
      {isVisibleRemoveButton && (
        <button onClick={handleClickRemove}>
          <Icon size="extraSmall" name="cancel" color={getIconColor(tag.color)} />
        </button>
      )}
    </span>
  )
}
