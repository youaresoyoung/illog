import { Text } from '../Typography'
import { DialogTitleProps } from './types'

export const DialogTitle = ({ children, className }: DialogTitleProps) => {
  return (
    <Text as="h2" textStyle="bodyStrong" textAlign="center" className={className}>
      {children}
    </Text>
  )
}
