import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'

type CenterOwnProps = {} & Omit<Sprinkles, 'display' | 'alignItems' | 'justifyContent'>

export type CenterProps<T extends ElementType = 'div'> = CenterOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, CenterOwnProps>>
