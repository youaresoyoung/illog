import { createContext, useContext, useMemo } from 'react'
import { TimePickerContextValue, TimePickerProps } from './types'

import { TimePickerInput } from './TimeInput'
import { TimePickerSeparator } from './TimePickerSeparator'
import { TimePickerRange } from './TimePickerRange'
import { TimePickerSummary } from './TimePickerSummary'
import { TimePickerTimeRange } from './TimePickerTimeRange'
import { TimePickerDateRange } from './TimePickerDateRange'

export const TimePickerContext = createContext<TimePickerContextValue | null>(null)

const TimePickerRoot = ({ value, onChange, children }: TimePickerProps) => {
  const startDate = useMemo(() => (value.start ? new Date(value.start) : null), [value.start])
  const endDate = useMemo(() => (value.end ? new Date(value.end) : null), [value.end])

  const isSameDay = useMemo(() => {
    if (!startDate || !endDate) return false
    return (
      startDate.getDate() === endDate.getDate() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    )
  }, [startDate, endDate])

  const contextValue = useMemo(
    () => ({
      value,
      onChange,
      startDate,
      endDate,
      isSameDay
    }),
    [value, onChange, startDate, endDate, isSameDay]
  )

  return <TimePickerContext.Provider value={contextValue}>{children}</TimePickerContext.Provider>
}

export const TimePicker = Object.assign(TimePickerRoot, {
  Input: TimePickerInput,
  Separator: TimePickerSeparator,
  Range: TimePickerRange,
  Summary: TimePickerSummary,
  TimeRange: TimePickerTimeRange,
  DateRange: TimePickerDateRange
})

export const useTimePickerContext = () => {
  const context = useContext(TimePickerContext)
  if (!context) {
    throw new Error('TimePicker compound components must be used within TimePicker')
  }
  return context
}
