import { formatDate, formatDay } from './formatTime'
import { useTimePickerContext } from './TimePicker'

type TimePickerDateRangeProps = {
  className?: string
  style?: React.CSSProperties
}

export const TimePickerDateRange = ({ className, style }: TimePickerDateRangeProps) => {
  const { startDate, endDate, isSameDay } = useTimePickerContext()

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
      {isSameDay && startDate ? (
        <>
          {formatDate(startDate)} ({formatDay(startDate)})
        </>
      ) : (
        <>
          {startDate && (
            <>
              {formatDate(startDate)} ({formatDay(startDate)})
            </>
          )}
          {startDate && endDate && ' - '}
          {endDate && !isSameDay && (
            <>
              {formatDate(endDate)} ({formatDay(endDate)})
            </>
          )}
        </>
      )}
    </div>
  )
}
