import { ElementType } from 'react'
import { BoxProps } from '../Box/types'

export type CardProps<T extends ElementType> = {
  onClick: () => void
} & BoxProps<T>
