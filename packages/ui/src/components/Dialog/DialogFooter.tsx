import { DialogFooterProps } from './types'
import { Inline } from '../Inline'

export const DialogFooter = ({ children, className }: DialogFooterProps) => {
  return (
    <Inline gap="400" width="100%" className={className}>
      {children}
    </Inline>
  )
}
