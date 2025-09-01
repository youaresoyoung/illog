import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'

type BoxOwnProps = {} & Sprinkles

export type BoxProps<T extends ElementType> = BoxOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, BoxOwnProps>>
