import { ReactNode } from 'react'
import { textStyle } from './text.css'
import { CSSProperties } from '@vanilla-extract/css'
import { Sprinkles } from '../../core/sprinkles.css'
import { AsProp, PropsToOmit } from '../../core/types'
import { textColors } from '../../core/tokens/generatedColors'
import { StyleProps } from '../../core/styleProps'

type TextOwnProps = {
  textStyle?: textStyle
  color?: keyof typeof textColors
  children?: ReactNode
  align?: CSSProperties['textAlign']
  className?: string
  style?: CSSProperties
  truncate?: 'true'
  lineClamp?: '1' | '2' | '3'
} & Omit<Sprinkles, keyof StyleProps | 'truncate' | 'lineClamp'> &
  StyleProps

export type TextProps<T extends React.ElementType> = TextOwnProps &
  AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, TextOwnProps>>
