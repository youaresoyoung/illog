import { formatTime, formatDate, formatDay } from './formatTime'
import { useTimePickerContext } from './TimePicker'
import { TimePickerSummaryProps } from './types'

export const TimePickerSummary = ({
  className,
  style,
  showTime = true,
  showDate = true
}: TimePickerSummaryProps) => {
  const { startDate, endDate, isSameDay } = useTimePickerContext()

  if (!startDate && !endDate) {
    return null
  }

  const defaultStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#787774',
    lineHeight: '1.5',
    ...style
  }

  return (
    <div className={className} style={defaultStyle}>
      {showTime && startDate && formatTime(startDate)}{' '}
      {showDate && !isSameDay && startDate && (
        <span>
          {formatDate(startDate)} ({formatDay(startDate)})
        </span>
      )}
      {!isSameDay && startDate && endDate && ' - '}
      {showTime && endDate && formatTime(endDate)}{' '}
      {showDate && !isSameDay && endDate && (
        <span>
          {formatDate(endDate)} ({formatDay(endDate)})
        </span>
      )}
      {showDate && isSameDay && startDate && (
        <span>
          {formatDate(startDate)} ({formatDay(startDate)})
        </span>
      )}
    </div>
  )
}
