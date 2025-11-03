import { textVariants } from './text.css'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { TextProps } from './types'
import { extractSprinkleProps } from '../../utils/util'
import { createElement, ElementType } from 'react'
import { textColors } from '../../core/tokens/generatedColors'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'

export const Text = <T extends ElementType>(props: TextProps<T>) => {
  const { as = 'p', textStyle = 'bodyBase', color, className, children, style } = props

  const [styleProps, withoutStyleProps] = extractStyleProps(props)
  const [sprinkleProps, restProps] = extractSprinkleProps(withoutStyleProps)

  const mergedStyle = { ...convertStylePropsToCSS(styleProps), ...style }

  return createElement(
    as,
    {
      ...restProps,
      className: clsx([textVariants[textStyle], sprinkles(sprinkleProps), className]),
      style: {
        ...mergedStyle,
        color: color ? textColors[color] : textColors.textDefaultDefault
      }
    },
    children
  )
}
