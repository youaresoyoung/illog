import { textVariants } from './text.css'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { TextProps } from './types'
import { tokens } from 'packages/themes/dist'
import { getKeyFromPath, splitSprinkleProps } from '../../utils/util'
import { createElement } from 'react'

export const Text = <T extends React.ElementType>(props: TextProps<T>) => {
  const { as = 'p', textStyle = 'bodyBase', color, className, children, ...rest } = props

  const [sprinkleProps, restProps] = splitSprinkleProps(rest)

  return createElement(as, {
    ...restProps,
    className: clsx([textVariants[textStyle], sprinkles(sprinkleProps), className]),
    style: {
      color: color
        ? getKeyFromPath(color, tokens.colors.light.text)
        : tokens.colors.light.text.default.default
    },
    children
  })
}
