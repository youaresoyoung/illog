import { TimeCell } from './TimeCell'
import { TimeGrid } from './TimeGrid'
import { DayColumnHeaders } from './DayColumnHeaders'

export const Calendar = {
  TimeCell,
  TimeGrid,
  DayColumnHeaders
}

export { useCurrentTime } from './hooks'
export { formatHour, formatTimeLabel, getMinutesFromMidnight } from './utils'
export { DEFAULT_HOUR_HEIGHT, DEFAULT_GUTTER_WIDTH, HOURS } from './constants'
export type {
  TimeCellProps,
  TimeCellColor,
  TimeGridProps,
  DayColumnHeader,
  DayColumnHeadersProps
} from './types'
