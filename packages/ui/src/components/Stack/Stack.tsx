import { createElement, ElementType } from 'react'
import { StackProps } from './types'
import { extractSprinkleProps } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'

/**
 * Stack - A flexible container component that arranges its children in a vertical or horizontal stack with customizable spacing, alignment, and wrapping options.
 *
 */
export const Stack = <T extends ElementType = 'div'>(props: StackProps<T>) => {
  const {
    as = 'div',
    className,
    children,
    direction = 'column',
    gap,
    align,
    justify,
    wrap = 'nowrap',
    style,
    ref
  } = props

  const [styleProps, withoutStyleProps] = extractStyleProps(props)
  const [sprinkleProps, restProps] = extractSprinkleProps(withoutStyleProps)

  const mergedStyle = { ...convertStylePropsToCSS(styleProps), ...style }

  const stackSprinkles = sprinkles({
    display: 'flex',
    flexDirection: direction,
    gap: gap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    ...sprinkleProps
  })

  return createElement(
    as,
    {
      ...restProps,
      className: clsx([stackSprinkles, className]),
      style: mergedStyle,
      ref
    },
    children
  )
}
