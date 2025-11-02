import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'
import { StyleProps } from '../../core/styleProps'

type StackOwnProps = {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  gap?: Sprinkles['gap']
  align?: Sprinkles['alignItems']
  justify?: Sprinkles['justifyContent']
  wrap?: Sprinkles['flexWrap']
} & Omit<
  Omit<Sprinkles, keyof StyleProps>,
  'display' | 'flexDirection' | 'gap' | 'alignItems' | 'justifyContent' | 'flexWrap'
> &
  StyleProps

export type StackProps<T extends ElementType = 'div'> = StackOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, StackOwnProps>>
