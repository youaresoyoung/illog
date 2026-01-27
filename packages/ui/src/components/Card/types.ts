import { ElementType, MouseEvent } from 'react'
import { BoxProps } from '../Box/types'

export type CardProps<T extends ElementType> = {
  onClick: (e: MouseEvent<HTMLDivElement>) => void
} & BoxProps<T>
