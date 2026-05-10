import { Stack } from '../Stack'
import { DialogContentProps } from './types'

export const DialogContent = ({ children, className }: DialogContentProps) => {
  return <Stack className={className}>{children}</Stack>
}
