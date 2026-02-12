import clsx from 'clsx'
import { BasicSelectorViewportProps } from './types'
import { viewport as viewportStyles } from './basicSelector.css'

export const Viewport = ({ children, className }: BasicSelectorViewportProps) => {
  return <div className={clsx(viewportStyles, className)}>{children}</div>
}
