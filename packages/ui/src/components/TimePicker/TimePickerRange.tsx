import { TimePickerRangeProps } from './types'
import { Inline } from '../Inline'

export const TimePickerRange = ({ children, className }: TimePickerRangeProps) => {
  return (
    <Inline gap="200" align="center" className={className}>
      {children}
    </Inline>
  )
}
