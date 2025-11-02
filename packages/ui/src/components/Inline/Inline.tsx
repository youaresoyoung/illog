import { createElement, ElementType } from 'react'
import { InlineProps } from './types'
import { extractSprinkleProps } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'

/**
 * Inline - A flexible container component that arranges its children in a horizontal line with customizable spacing, alignment, and wrapping options.
 *
 */
export const Inline = <T extends ElementType = 'div'>(props: InlineProps<T>) => {
  const { as = 'div', className, children, gap, align, justify, wrap = 'nowrap', style } = props

  const [styleProps, withoutStyleProps] = extractStyleProps(props)
  const [sprinkleProps, restProps] = extractSprinkleProps(withoutStyleProps)

  const mergedStyle = {
    ...convertStylePropsToCSS(styleProps),
    ...style
  }

  const inlineSprinkles = sprinkles({
    display: 'flex',
    flexDirection: 'row',
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
      className: clsx([inlineSprinkles, className]),
      style: mergedStyle
    },
    children
  )
}
