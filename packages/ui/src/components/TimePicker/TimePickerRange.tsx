import { TimePickerRangeProps } from './types'
import { Inline } from '../Inline'

export const TimePickerRange = ({ children, className }: TimePickerRangeProps) => {
  return (
    <Inline gap="200" align="center" mb="200" className={className}>
      {children}
    </Inline>
  )
}
