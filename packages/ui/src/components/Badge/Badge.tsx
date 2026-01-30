import { MouseEvent } from 'react'
import { Icon } from '../Icon'
import clsx from 'clsx'
import * as style from './badge.css'
import { textColors } from '../../core/tokens/generatedColors'
import { BadgeProps } from './types'
import { Inline } from '../Inline'

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getIconColor = (color: string) => {
  return `textTag${capitalize(color) as Capitalize<typeof color>}` as keyof typeof textColors
}

export const Badge = ({
  item,
  addButtonVariant,
  isOpenedSelector,
  withoutIcon,
  className,
  openSelector,
  onRemove
}: BadgeProps) => {
  if (addButtonVariant) {
    return (
      <button
        className={clsx([
          style.badgeBase,
          style.addButtonRecipe({ variant: addButtonVariant }),
          className
        ])}
        onClick={(e: MouseEvent<HTMLButtonElement>) => openSelector?.(e)}
      >
        <span className={style.badgeText}>{item.name}</span>
        <Icon
          size="extraSmall"
          name="chevron_down"
          color={addButtonVariant === 'error' ? 'iconDangerDefault' : 'iconDefaultSecondary'}
          rotate={isOpenedSelector ? 180 : 0}
        />
      </button>
    )
  }

  if (onRemove) {
    return (
      <Inline
        className={clsx([style.badgeRecipe({ color: item.color ?? 'gray' }), className])}
        maxWidth="100%"
      >
        <Inline as="span" truncate="true">
          {item.name}
        </Inline>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={style.removeButton}
          aria-label={`Remove ${item.name}`}
        >
          <Icon size="extraSmall" name="cancel" color={getIconColor(item.color ?? 'gray')} />
        </button>
      </Inline>
    )
  }

  return (
    <Inline
      className={clsx([style.badgeRecipe({ color: item.color ?? 'gray' }), className])}
      maxWidth="100%"
      overflow="hidden"
    >
      <Inline as="span" truncate="true">
        {item.name}
      </Inline>
      {!withoutIcon && (
        <Icon
          size="extraSmall"
          name="chevron_down"
          color={getIconColor(item.color ?? 'gray')}
          rotate={isOpenedSelector ? 180 : 0}
        />
      )}
    </Inline>
  )
}
