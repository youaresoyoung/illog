import { CSSProperties } from 'react'
import { formatTime } from './formatTime'
import { useTimePickerContext } from './TimePicker'

type TimePickerTimeRangeProps = {
  className?: string
  style?: CSSProperties
}

export const TimePickerTimeRange = ({ className, style }: TimePickerTimeRangeProps) => {
  const { startDate, endDate } = useTimePickerContext()

  if (!startDate && !endDate) {
    return null
  }

  const defaultStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#787774',
    ...style
  }

  return (
    <div className={className} style={defaultStyle}>
      {startDate && formatTime(startDate)}
      {startDate && endDate && ' - '}
      {endDate && formatTime(endDate)}
    </div>
  )
}
