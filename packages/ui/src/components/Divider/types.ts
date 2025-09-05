import { HTMLAttributes } from 'react'

export type DividerProps = {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed'
  color?: 'default'
  thickness?: 'thin'
} & HTMLAttributes<HTMLDivElement>
