import { Text } from '../Typography'
import { DialogDescriptionProps } from './types'

export const DialogDescription = ({ children, className }: DialogDescriptionProps) => {
  return (
    <Text as="p" textStyle="bodyBase" color="textBrandTertiary" className={className}>
      {children}
    </Text>
  )
}
