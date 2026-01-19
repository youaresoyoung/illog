import { ComponentPropsWithRef, ElementType } from 'react'
import { AsProp, PropsToOmit } from '../../core/types'
import { Sprinkles } from '../../core/sprinkles.css'
import { StyleProps } from '../../core/styleProps'
import { InteractionProps } from '../../core/interactionProps'

type BoxOwnProps = Omit<Sprinkles, keyof StyleProps> & StyleProps & InteractionProps

export type BoxProps<T extends ElementType> = BoxOwnProps &
  AsProp<T> &
  Omit<ComponentPropsWithRef<T>, PropsToOmit<T, BoxOwnProps>>
