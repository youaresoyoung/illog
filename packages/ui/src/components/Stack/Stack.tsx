import { createElement, ElementType } from 'react'
import { StackProps } from './types'
import { splitSprinkleProps } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'

/**
 * Stack - A flexible container component that arranges its children in a vertical or horizontal stack with customizable spacing, alignment, and wrapping options.
 *
 * @example
 * <Stack direction="column" gap="200" align="center">
 *   <Button />
 *   <Button />
 * </Stack>
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
    ...restProps
  } = props

  const [sprinkleProps, nativeProps] = splitSprinkleProps(restProps)

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
      ...nativeProps,
      className: clsx([stackSprinkles, className])
    },
    children
  )
}
