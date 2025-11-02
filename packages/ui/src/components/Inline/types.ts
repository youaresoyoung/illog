import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'
import { StyleProps } from '../../core/styleProps'

type InlineOwnProps = {
  gap?: Sprinkles['gap']
  align?: Sprinkles['alignItems']
  justify?: Sprinkles['justifyContent']
  wrap?: Sprinkles['flexWrap']
} & Omit<
  Omit<Sprinkles, keyof StyleProps>,
  'display' | 'flexDirection' | 'gap' | 'alignItems' | 'justifyContent' | 'flexWrap'
> &
  StyleProps

export type InlineProps<T extends ElementType = 'div'> = InlineOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, InlineOwnProps>>
