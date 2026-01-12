import { MouseEvent } from 'react'
import { Icon } from '../Icon'
import clsx from 'clsx'
import * as style from './projectBadge.css'
import { textColors } from '../../core/tokens/generatedColors'
import { ProjectBadgeProps } from './types'
import { Inline } from '../Inline'

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getIconColor = (color: string) => {
  return `textTag${capitalize(color) as Capitalize<typeof color>}` as keyof typeof textColors
}

export const ProjectBadge = ({
  project,
  addButtonVariant,
  isOpenedSelector,
  className,
  openProjectSelector,
  onRemove
}: ProjectBadgeProps) => {
  if (addButtonVariant) {
    return (
      <button
        className={clsx([
          style.badgeBase,
          style.addButtonRecipe({ variant: addButtonVariant }),
          className
        ])}
        onClick={(e: MouseEvent<HTMLButtonElement>) => openProjectSelector?.(e)}
      >
        <span>{project.name}</span>
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
        className={clsx([style.badgeRecipe({ color: project.color }), className])}
        maxWidth="100%"
      >
        <Inline as="span" truncate="true">
          {project.name}
        </Inline>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={style.removeButton}
          aria-label={`Remove ${project.name}`}
        >
          <Icon size="extraSmall" name="cancel" color={getIconColor(project.color)} />
        </button>
      </Inline>
    )
  }

  return (
    <Inline
      className={clsx([style.badgeRecipe({ color: project.color }), className])}
      maxWidth="100%"
    >
      <Inline as="span" truncate="true">
        {project.name}
      </Inline>
      <Icon
        size="extraSmall"
        name="chevron_down"
        color={getIconColor(project.color)}
        rotate={isOpenedSelector ? 180 : 0}
      />
    </Inline>
  )
}
