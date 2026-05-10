import { assignInlineVars } from '@vanilla-extract/dynamic'
import { backgroundColors, textColors, borderColors } from './tokens/generatedColors'
import { shadowTokens } from './sprinkles.css'
import { interactionVars } from './interactionStyles.css'

export type BackgroundColorToken = keyof typeof backgroundColors
export type TextColorToken = keyof typeof textColors
export type BorderColorToken = keyof typeof borderColors
export type BoxShadowToken = keyof typeof shadowTokens

export type InteractionStyleProps = {
  bg?: BackgroundColorToken | (string & {})
  color?: TextColorToken | (string & {})
  borderColor?: BorderColorToken | (string & {})
  opacity?: number | string
  boxShadow?: BoxShadowToken | (string & {})
  filter?: string
}

export type InteractionProps = {
  _hover?: InteractionStyleProps
  _active?: InteractionStyleProps
  _focus?: InteractionStyleProps
  _focusVisible?: InteractionStyleProps
  _disabled?: InteractionStyleProps
  isActive?: boolean
  isDisabled?: boolean
}

const resolveBgColor = (value: string | undefined): string | undefined => {
  if (!value) return undefined
  return (backgroundColors as Record<string, string>)[value] ?? value
}

const resolveTextColor = (value: string | undefined): string | undefined => {
  if (!value) return undefined
  return (textColors as Record<string, string>)[value] ?? value
}

const resolveBorderColor = (value: string | undefined): string | undefined => {
  if (!value) return undefined
  return (borderColors as Record<string, string>)[value] ?? value
}

const resolveBoxShadow = (value: BoxShadowToken | string | undefined): string | undefined => {
  if (value === undefined) return undefined
  const strValue = String(value)
  return (shadowTokens as Record<string, string>)[strValue] ?? strValue
}

const resolveOpacity = (value: number | string | undefined): string | undefined => {
  if (value === undefined) return undefined
  return String(value)
}

export const INTERACTION_PROP_KEYS = [
  '_hover',
  '_active',
  '_focus',
  '_focusVisible',
  '_disabled',
  'isActive',
  'isDisabled'
] as const

type InteractionState = '_hover' | '_active' | '_focus' | '_focusVisible' | '_disabled'

function resolveStateStyles(styles: InteractionStyleProps | undefined) {
  if (!styles) return {}

  return {
    bg: resolveBgColor(styles.bg),
    color: resolveTextColor(styles.color),
    borderColor: resolveBorderColor(styles.borderColor),
    opacity: resolveOpacity(styles.opacity),
    boxShadow: resolveBoxShadow(styles.boxShadow),
    filter: styles.filter
  }
}

export type BaseStyleValues = {
  bg?: string
  color?: string
  borderColor?: string
  opacity?: string
  boxShadow?: string
  filter?: string
}

export function buildInteractionVars(
  props: InteractionProps,
  baseStyles?: BaseStyleValues
): Record<string, string> {
  const vars: Record<string, string> = {}

  const states: InteractionState[] = ['_hover', '_active', '_focus', '_focusVisible', '_disabled']

  for (const state of states) {
    const stateProps = props[state]
    if (!stateProps) continue

    const resolved = resolveStateStyles(stateProps)
    const stateVars = interactionVars[state]

    // For each property in this state, set the CSS variable.
    // If a property is NOT set in this state but HAS a base value,
    // fill the variable with the base value so the hover selector
    // doesn't reset it to initial (due to higher specificity).
    const base = baseStyles ?? {}

    vars[stateVars.bg] = resolved.bg || base.bg || ''
    vars[stateVars.color] = resolved.color || base.color || ''
    vars[stateVars.borderColor] = resolved.borderColor || base.borderColor || ''
    vars[stateVars.opacity] = resolved.opacity || base.opacity || ''
    vars[stateVars.boxShadow] = resolved.boxShadow || base.boxShadow || ''
    vars[stateVars.filter] = resolved.filter || base.filter || ''
  }

  // Remove empty entries — CSS variables with empty string values are still "set"
  // but produce invalid property values, which is what we want to avoid.
  for (const key of Object.keys(vars)) {
    if (!vars[key]) delete vars[key]
  }

  return Object.keys(vars).length > 0 ? assignInlineVars(vars) : {}
}

export function hasInteractionProps(props: InteractionProps): boolean {
  return Boolean(
    props._hover || props._active || props._focus || props._focusVisible || props._disabled
  )
}

export function getInteractionDataAttrs(
  props: InteractionProps
): Record<string, boolean | undefined> {
  const attrs: Record<string, boolean | undefined> = {}

  if (props.isActive !== undefined) {
    attrs['data-active'] = props.isActive
  }
  if (props.isDisabled !== undefined) {
    attrs['data-disabled'] = props.isDisabled
  }

  return attrs
}

/**
 * Resolve current base CSS values from sprinkle and style props.
 * Used to fill in CSS variables for interaction states that don't
 * explicitly set a property, preventing the hover selector from
 * resetting it to `initial` due to higher specificity.
 */
export function resolveBaseStyles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sprinkleProps: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styleProps?: Record<string, any>
): BaseStyleValues {
  const base: BaseStyleValues = {}

  // Resolve bg from sprinkle props (bg is shorthand for backgroundColor)
  const bgToken = sprinkleProps.bg ?? sprinkleProps.backgroundColor
  if (bgToken) {
    base.bg = resolveBgColor(String(bgToken)) ?? undefined
  }

  const colorToken = sprinkleProps.color
  if (colorToken) {
    base.color = resolveTextColor(String(colorToken)) ?? undefined
  }

  const borderColorToken = sprinkleProps.borderColor
  if (borderColorToken) {
    base.borderColor = resolveBorderColor(String(borderColorToken)) ?? undefined
  }

  // Also check inline style props for opacity
  if (styleProps?.opacity !== undefined) {
    base.opacity = String(styleProps.opacity)
  }

  return base
}
