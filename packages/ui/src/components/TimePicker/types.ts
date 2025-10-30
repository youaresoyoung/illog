import { CSSProperties, ReactNode } from 'react'

export type TimePickerValue = {
  start: string | null
  end: string | null
}

export type TimePickerProps = {
  value: TimePickerValue
  onChange: (value: TimePickerValue) => void
  children: ReactNode
}

export type TimePickerInputProps = {
  field: 'start' | 'end'
  placeholder?: string
  className?: string
  style?: CSSProperties
}

export type TimePickerSummaryProps = {
  className?: string
  style?: CSSProperties
  showTime?: boolean
  showDate?: boolean
}

export type TimePickerRangeProps = {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type TimePickerSeparatorProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export type TimePickerContextValue = {
  value: TimePickerValue
  onChange: (value: TimePickerValue) => void
  startDate: Date | null
  endDate: Date | null
  isSameDay: boolean
}
