import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'
import { StyleProps } from '../../core/styleProps'
import { backgroundColors, textColors } from '../../core/tokens/generatedColors'

export type BackgroundColorToken = keyof typeof backgroundColors
export type TextColorToken = keyof typeof textColors

export type InlineInteractionProps = {
  hoverBg?: BackgroundColorToken | (string & {})
  hoverColor?: TextColorToken | (string & {})
  activeBg?: BackgroundColorToken | (string & {})
  activeColor?: TextColorToken | (string & {})
  isActive?: boolean
}

type InlineOwnProps = {
  gap?: Sprinkles['gap']
  align?: Sprinkles['alignItems']
  justify?: Sprinkles['justifyContent']
  wrap?: Sprinkles['flexWrap']
} & InlineInteractionProps &
  Omit<
    Omit<Sprinkles, keyof StyleProps>,
    'display' | 'flexDirection' | 'gap' | 'alignItems' | 'justifyContent' | 'flexWrap'
  > &
  StyleProps

export type InlineProps<T extends ElementType = 'div'> = InlineOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, InlineOwnProps>>
