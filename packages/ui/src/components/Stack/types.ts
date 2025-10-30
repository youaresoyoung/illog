import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'

type StackOwnProps = {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  gap?: Sprinkles['gap']
  align?: Sprinkles['alignItems']
  justify?: Sprinkles['justifyContent']
  wrap?: Sprinkles['flexWrap']
} & Omit<
  Sprinkles,
  'display' | 'flexDirection' | 'gap' | 'alignItems' | 'justifyContent' | 'flexWrap'
>

export type StackProps<T extends ElementType = 'div'> = StackOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, StackOwnProps>>
