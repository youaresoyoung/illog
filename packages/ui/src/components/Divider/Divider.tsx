import { divider } from './divider.css'
import clsx from 'clsx'
import { DividerProps } from './types'

export const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'default',
  thickness = 'thin',
  className,
  ...props
}: DividerProps) => {
  return (
    <div
      className={clsx(divider({ orientation, variant, color, thickness }), className)}
      {...props}
    />
  )
}
