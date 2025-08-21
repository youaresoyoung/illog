import { ReactNode } from 'react'
import { textStyle } from './text.css'
import { CSSProperties } from '@vanilla-extract/css'
import { Sprinkles } from '../../core/sprinkles.css'
import { AsProp, NestedKeys, PropsToOmit } from '../../core/types'
import { tokens } from 'packages/themes/dist'

type TextColorToken = NestedKeys<typeof tokens.colors.light.text>

type TextOwnProps = {
  textStyle?: textStyle
  color?: TextColorToken
  children?: ReactNode
  align?: CSSProperties['textAlign']
  className?: string
  style?: CSSProperties
} & Sprinkles

export type TextProps<T extends React.ElementType> = TextOwnProps &
  AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, TextOwnProps>>
