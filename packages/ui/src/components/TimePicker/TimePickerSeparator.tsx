import { TimePickerSeparatorProps } from './types'
import { Box } from '../Box'

export const TimePickerSeparator = ({ children = '–', className }: TimePickerSeparatorProps) => {
  return (
    <Box as="span" color="textDefaultSecondary" className={className}>
      {children}
    </Box>
  )
}
