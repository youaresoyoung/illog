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
    boxShadow: resolveBoxShadow(styles.boxShadow)
  }
}

export function buildInteractionVars(props: InteractionProps): Record<string, string> {
  const vars: Record<string, string> = {}

  const states: InteractionState[] = ['_hover', '_active', '_focus', '_focusVisible', '_disabled']

  for (const state of states) {
    const stateProps = props[state]
    if (!stateProps) continue

    const resolved = resolveStateStyles(stateProps)
    const stateVars = interactionVars[state]

    if (resolved.bg) vars[stateVars.bg] = resolved.bg
    if (resolved.color) vars[stateVars.color] = resolved.color
    if (resolved.borderColor) vars[stateVars.borderColor] = resolved.borderColor
    if (resolved.opacity) vars[stateVars.opacity] = resolved.opacity
    if (resolved.boxShadow) vars[stateVars.boxShadow] = resolved.boxShadow
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
