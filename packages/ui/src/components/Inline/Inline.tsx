import { createElement, ElementType } from 'react'
import { InlineProps } from './types'
import { extractSprinkleProps, omit } from '../../utils/util'
import { sprinkles } from '../../core/sprinkles.css'
import clsx from 'clsx'
import { convertStylePropsToCSS, extractStyleProps } from '../../core/styleProps'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import {
  hoverBgVar,
  hoverColorVar,
  activeBgVar,
  activeColorVar,
  inlineInteractive
} from './Inline.css'
import { backgroundColors, textColors } from '../../core/tokens/generatedColors'

const INTERACTION_PROPS = ['hoverBg', 'hoverColor', 'activeBg', 'activeColor', 'isActive'] as const

const resolveBgColor = (value: string | undefined): string | undefined => {
  if (!value) return undefined
  return (backgroundColors as Record<string, string>)[value] ?? value
}

const resolveTextColor = (value: string | undefined): string | undefined => {
  if (!value) return undefined
  return (textColors as Record<string, string>)[value] ?? value
}

/**
 * Inline - A flexible container component that arranges its children in a horizontal line with customizable spacing, alignment, and wrapping options.
 *
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
    hoverBg,
    hoverColor,
    activeBg,
    activeColor,
    isActive
  } = props

  const [styleProps, withoutStyleProps] = extractStyleProps(props)
  const [sprinkleProps, restProps] = extractSprinkleProps(withoutStyleProps)

  const cleanRestProps = omit(restProps, [...INTERACTION_PROPS])

  const hasInteraction = hoverBg || hoverColor || activeBg || activeColor

  const resolvedHoverBg = resolveBgColor(hoverBg)
  const resolvedHoverColor = resolveTextColor(hoverColor)
  const resolvedActiveBg = resolveBgColor(activeBg)
  const resolvedActiveColor = resolveTextColor(activeColor)

  const interactionVars = hasInteraction
    ? assignInlineVars({
        ...(resolvedHoverBg && { [hoverBgVar]: resolvedHoverBg }),
        ...(resolvedHoverColor && { [hoverColorVar]: resolvedHoverColor }),
        ...(resolvedActiveBg && { [activeBgVar]: resolvedActiveBg }),
        ...(resolvedActiveColor && { [activeColorVar]: resolvedActiveColor })
      })
    : {}
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
      ...cleanRestProps,
      className: clsx([inlineSprinkles, hasInteraction && inlineInteractive, className]),
      style: mergedStyle,
      ...(hasInteraction && { 'data-active': isActive })
    },
    children
  )
}
