import { textVariants } from './text.css'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { TextProps } from './types'
import { extractSprinkleProps, omit } from '../../utils/util'
import { createElement, ElementType } from 'react'
import { textColors } from '../../core/tokens/generatedColors'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'

export const Text = <T extends ElementType>(props: TextProps<T>) => {
  const {
    as = 'p',
    textStyle = 'bodyBase',
    color,
    className,
    children,
    style,
    truncate,
    lineClamp
  } = props

  const [styleProps, withoutStyleProps] = extractStyleProps(props)
  const [sprinkleProps, rawRestProps] = extractSprinkleProps(withoutStyleProps)
  const restProps = omit(rawRestProps, [
    'as',
    'textStyle',
    'className',
    'children',
    'style'
  ] as const)

  const truncateStyle =
    truncate === 'true'
      ? {
          overflow: 'hidden' as const,
          textOverflow: 'ellipsis' as const,
          whiteSpace: 'nowrap' as const,
          minWidth: 0
        }
      : {}

  const lineClampStyle = lineClamp
    ? {
        display: '-webkit-box',
        WebkitLineClamp: Number(lineClamp),
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden' as const,
        minWidth: 0
      }
    : {}

  const mergedStyle = {
    ...convertStylePropsToCSS(styleProps),
    ...truncateStyle,
    ...lineClampStyle,
    ...style
  }

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
