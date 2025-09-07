import { MouseEvent } from 'react'
import { Icon } from '../Icon'
import clsx from 'clsx'
import * as style from './tag.css'
import { iconColors, textColors } from '../../core/tokens/generatedColors'
import { TagProps } from './types'

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getIconColor = (color: string) => {
  return `textTag${capitalize(color) as Capitalize<typeof color>}` as keyof typeof textColors
}

export const Tag = ({
  tag,
  addTagButtonVariant = 'default',
  className,
  openTagSelector,
  removeFromTask
}: TagProps) => {
  const handleClickRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if ('id' in tag && tag.id) {
      removeFromTask?.(tag.id)
    }
  }

  if (openTagSelector) {
    return (
      <button
        className={clsx([
          style.tagBase,
          style.addTagButtonRecipe({ variant: addTagButtonVariant }),
          className
        ])}
        onClick={(e: MouseEvent<HTMLButtonElement>) => openTagSelector?.(e)}
      >
        <Icon
          size="extraSmall"
          name="plus"
          color={addTagButtonVariant === 'error' ? 'iconDangerDefault' : 'iconDefaultSecondary'}
        />
        <span>{tag.name}</span>
      </button>
    )
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
