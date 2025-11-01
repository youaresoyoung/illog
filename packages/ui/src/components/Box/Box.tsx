import { createElement, ElementType } from 'react'
import { BoxProps } from './types'
import { extractSprinkleProps } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'

/**
 * Box - A versatile container component that applies styling and layout properties.
 */
export const Box = <T extends ElementType>(props: BoxProps<T>) => {
  const { as = 'div', className, children, style } = props

  const [styleProps, withoutStyleProps] = extractStyleProps(props)
  const [sprinkleProps, restProps] = extractSprinkleProps(withoutStyleProps)

  const mergedStyle = {
    ...convertStylePropsToCSS(styleProps),
    ...style
  }

  return createElement(
    as,
    {
      ...restProps,
      className: clsx([sprinkles(sprinkleProps), className]),
      style: mergedStyle
    },
    children
  )
}
