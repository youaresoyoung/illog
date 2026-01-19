import { createElement, ElementType } from 'react'
import { InlineProps } from './types'
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
 * Inline - A flexible container component that arranges its children in a horizontal line with customizable spacing, alignment, and wrapping options.
 *
 * @example
 * // Basic usage
 * <Inline gap="8">
 *   <Button>One</Button>
 *   <Button>Two</Button>
 * </Inline>
 *
 * @example
 * // With interaction states
 * <Inline
 *   bg="backgroundBrandDefault"
 *   _hover={{bg: "backgroundBrandDefaultHover", color: "textBrandDefault"}}
 *   _active={{ bg: "backgroundBrandDefaultHover" }}
 *   _disabled={{ opacity: 0.5 }}
 *   isActive={isSelected}
 * >
 *   Interactive content
 * </Inline>
 */
export const Inline = <T extends ElementType = 'div'>(props: InlineProps<T>) => {
  const {
    as = 'div',
    className,
    children,
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
      ...restPropsWithoutInteractionProps,
      ...dataAttrs,
      className: clsx([inlineSprinkles, hasInteraction && interactiveBase, className]),
      style: mergedStyle
    },
    children
  )
}
