import { formatTime, formatDate, formatDay } from './formatTime'
import { useTimePickerContext } from './TimePicker'
import { TimePickerSummaryProps } from './types'
import { Box } from '../Box'
import { Text } from '../Typography'

export const TimePickerSummary = ({
  className,
  showTime = true,
  showDate = true
}: TimePickerSummaryProps) => {
  const { startDate, endDate, isSameDay } = useTimePickerContext()

  if (!startDate && !endDate) {
    return null
  }

  return (
    <Box className={className}>
      {showTime && startDate && formatTime(startDate)}{' '}
      {showDate && !isSameDay && startDate && (
        <Text as="span" textStyle="singleLineCaption" color="textBrandTertiary">
          {formatDate(startDate)} ({formatDay(startDate)})
        </Text>
      )}
      {!isSameDay && startDate && endDate && ' - '}
      {showTime && endDate && formatTime(endDate)}{' '}
      {showDate && !isSameDay && endDate && (
        <Text as="span" textStyle="singleLineCaption" color="textBrandTertiary">
          {formatDate(endDate)} ({formatDay(endDate)})
        </Text>
      )}
      {showDate && isSameDay && startDate && (
        <Text as="span" textStyle="singleLineCaption" color="textBrandTertiary">
          {formatDate(startDate)} ({formatDay(startDate)})
        </Text>
      )}
    </Box>
  )
}
