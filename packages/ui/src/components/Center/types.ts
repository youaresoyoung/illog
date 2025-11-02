import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'
import { StyleProps } from '../../core/styleProps'

type CenterOwnProps = Omit<
  Omit<Sprinkles, keyof StyleProps>,
  'display' | 'alignItems' | 'justifyContent'
> &
  StyleProps

export type CenterProps<T extends ElementType = 'div'> = CenterOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, CenterOwnProps>>
