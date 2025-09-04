import { MouseEvent } from 'react'
import { Icon } from '../Icon'
import clsx from 'clsx'
import { tagRecipe } from './tag.css'
import { textColors } from '../../core/tokens/generatedColors'
import { TagProps } from './types'

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const Tag = ({ tag, className, isVisibleRemoveButton, onRemove }: TagProps) => {
  const textColor =
    `textTag${capitalize(tag.color) as Capitalize<typeof tag.color>}` as keyof typeof textColors

  const handleClickRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if ('id' in tag && tag.id) {
      onRemove?.(tag.id)
    }
  }

  return (
    <span className={clsx([tagRecipe({ color: tag.color }), className])}>
      {tag.name}
      {isVisibleRemoveButton && (
        <button onClick={handleClickRemove}>
          <Icon size="extraSmall" name="cancel" color={textColor} />
        </button>
      )}
    </span>
  )
}
