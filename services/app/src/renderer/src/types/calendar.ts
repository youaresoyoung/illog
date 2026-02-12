import { TaskWithTags } from 'services/app/src/shared/types'

export type CalendarTask = {
  task: TaskWithTags
  startMinutes: number
  durationMinutes: number
}

export type LayoutColumn = {
  calendarTask: CalendarTask
  columnIndex: number
  totalColumns: number // total columns in the same overlap group
}
