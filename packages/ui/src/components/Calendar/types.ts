import type { ReactNode, CSSProperties } from 'react'
import { BackgroundColorToken, TextColorToken } from '../../core/interactionProps'

export type TimeCellColor = {
  bg: BackgroundColorToken
  border: string
  text: TextColorToken
}

export type TimeCellProps = {
  id: string
  title: string
  subtitle?: string
  caption?: string
  color: TimeCellColor
  top: number
  height: number
  left: string
  width: string
  style?: CSSProperties
  children?: ReactNode
  titleFontSize?: number
  subtitleFontSize?: number
  onClick?: () => void
}

export type DayColumnHeader = {
  label: string
  dateNum: string
  isToday?: boolean
}

export type DayColumnHeadersProps = {
  days: DayColumnHeader[]
  gutterWidth?: number
  height?: number
}

export type TimeGridProps = {
  columns?: number
  hourHeight?: number
  gutterWidth?: number
  scrollHeight?: string
  showCurrentTime?: boolean
  currentTimeColumn?: number
  header?: ReactNode
  children?: ReactNode
  style?: CSSProperties
}

export type HourRowProps = {
  hour: number
  hourHeight: number
  gutterWidth: number
  columns: number
}

export type CurrentTimeIndicatorProps = {
  nowMinutes: number
  hourHeight: number
  gutterWidth: number
  columns: number
  currentTimeColumn: number
  timeLabel: string
}
