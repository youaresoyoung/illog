import { createElement, ElementType } from 'react'
import { BoxProps } from './types'
import { extractSprinkleProps } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'

export const Box = <T extends ElementType>(props: BoxProps<T>) => {
  const { as = 'div', className, children } = props

  const [sprinkleProps, restProps] = extractSprinkleProps(props)

  return createElement(
    as,
    {
      ...restProps,
      className: clsx([sprinkles(sprinkleProps), className])
    },
    children
  )
}
