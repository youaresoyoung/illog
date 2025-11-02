import { textVariants } from './text.css'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { TextProps } from './types'
import { extractSprinkleProps } from '../../utils/util'
import { createElement } from 'react'
import { textColors } from '../../core/tokens/generatedColors'

export const Text = <T extends React.ElementType>(props: TextProps<T>) => {
  const { as = 'p', textStyle = 'bodyBase', color, className, children, ...rest } = props

  const [sprinkleProps, restProps] = extractSprinkleProps(rest)

  return createElement(
    as,
    {
      ...restProps,
      className: clsx([textVariants[textStyle], sprinkles(sprinkleProps), className]),
      style: {
        color: color ? textColors[color] : textColors.textDefaultDefault
      }
    },
    children
  )
}
