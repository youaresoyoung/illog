import { createElement, ElementType } from 'react'
import { CenterProps } from './types'
import { extractSprinkleProps } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'

/**
 * Center - A container component that centers its children both vertically and horizontally.
 *
 * @example
 * <Center>
 *   <Spinner />
 * </Center>
 */
export const Center = <T extends ElementType = 'div'>(props: CenterProps<T>) => {
  const { as = 'div', className, children, ...restProps } = props

  const [sprinkleProps, nativeProps] = extractSprinkleProps(restProps)

  const centerSprinkles = sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...sprinkleProps
  })

  return createElement(
    as,
    {
      ...nativeProps,
      className: clsx([centerSprinkles, className])
    },
    children
  )
}
