import { createElement, ElementType } from 'react'
import { BoxProps } from './types'
import { extractSprinkleProps, omit } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'
import {
  INTERACTION_PROP_KEYS,
  buildInteractionVars,
  hasInteractionProps,
  getInteractionDataAttrs
} from '../../core/interactionProps'
import { interactiveBase } from '../../core/interactionStyles.css'

/**
 * Box - A versatile container component that applies styling and layout properties.
 *
 * @example
 * // Basic usage
 * <Box padding="16" bg="surface.default">
 *   Content
 * </Box>
 *
 * @example
 * // With interaction states
 * <Box
 *   bg="surface.default"
 *   _hover={{ bg: "surface.hover" }}
 *   _active={{ bg: "surface.active" }}
 * >
 *   Interactive content
 * </Box>
 */
export const Box = <T extends ElementType>(props: BoxProps<T>) => {
  const {
    as = 'div',
    className,
    children,
    style,
    _hover,
    _active,
    _focus,
    _focusVisible,
    _disabled,
    isActive,
    isDisabled
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

  const mergedStyle = {
    ...convertStylePropsToCSS(styleProps),
    ...interactionVars,
    ...style
  }

  return createElement(
    as,
    {
      ...restPropsWithoutInteractionProps,
      ...dataAttrs,
      className: clsx([sprinkles(sprinkleProps), hasInteraction && interactiveBase, className]),
      style: mergedStyle
    },
    children
  )
}
