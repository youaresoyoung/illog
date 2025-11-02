import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'
import { StyleProps } from '../../core/styleProps'

type BoxOwnProps = Omit<Sprinkles, keyof StyleProps> & StyleProps

export type BoxProps<T extends ElementType> = BoxOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, BoxOwnProps>>
