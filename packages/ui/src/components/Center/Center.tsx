import { createElement, ElementType } from 'react'
import { CenterProps } from './types'
import { extractSprinkleProps } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'

/**
 * Center - A container component that centers its children both vertically and horizontally.
 */
export const Center = <T extends ElementType = 'div'>(props: CenterProps<T>) => {
  const { as = 'div', className, children, style } = props

  const [styleProps, withoutStyleProps] = extractStyleProps(props)
  const [sprinkleProps, restProps] = extractSprinkleProps(withoutStyleProps)

  const mergedStyle = {
    ...convertStylePropsToCSS(styleProps),
    ...style
  }

  const centerSprinkles = sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...sprinkleProps
  })

  return createElement(
    as,
    {
      ...restProps,
      className: clsx([centerSprinkles, className]),
      style: mergedStyle
    },
    children
  )
}
