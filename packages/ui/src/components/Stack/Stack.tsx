import { createElement, ElementType } from 'react'
import { StackProps } from './types'
import { extractSprinkleProps, omit } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'
import {
  buildInteractionVars,
  getInteractionDataAttrs,
  hasInteractionProps,
  INTERACTION_PROP_KEYS
} from '../../core/interactionProps'
import { interactiveBase } from '../../core/interactionStyles.css'

/**
 * Stack - A flexible container component that arranges its children in a vertical or horizontal stack with customizable spacing, alignment, and wrapping options.
 *
 * @example
 * // Basic usage
 * <Stack gap="400">
 *   <Button>One</Button>
 *   <Button>Two</Button>
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
    style,
    _hover,
    _active,
    _focus,
    _focusVisible,
    _disabled,
    isActive,
    isDisabled,
    ref
  } = props

  const [styleProps, withoutStyleProps] = extractStyleProps(props)
  const [sprinkleProps, restProps] = extractSprinkleProps(withoutStyleProps)

  const restPropsWithoutInteractionProps = omit(restProps, [...INTERACTION_PROP_KEYS])
  const interactionProps = {
    _hover,
    _active,
    _focus,
    _focusVisible,
    _disabled,
    isActive,
    isDisabled
  }
  const hasInteraction = hasInteractionProps(interactionProps)
  const interactionVars = buildInteractionVars(interactionProps)
  const dataAttrs = hasInteraction ? getInteractionDataAttrs(interactionProps) : {}

  const mergedStyle = { ...convertStylePropsToCSS(styleProps), ...interactionVars, ...style }

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
      ...restPropsWithoutInteractionProps,
      ...dataAttrs,
      className: clsx([stackSprinkles, hasInteraction && interactiveBase, className]),
      style: mergedStyle,
      ref
    },
    children
  )
}
