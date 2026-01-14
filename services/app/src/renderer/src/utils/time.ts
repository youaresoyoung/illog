import { differenceInMinutes, endOfWeek, startOfWeek } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { TaskWithTags } from '../../../shared/types'

// Note: in the future, user can choose week's start (Sun or Mon)
type WEEK_START = 0 | 1

export function getThisWeekDateRange(timeZone: string) {
  const now = new Date()
  const weekStartsOn: WEEK_START = 1

  const currentTimeInTimeZone = toZonedTime(now, timeZone)

  const startOfThisWeek = startOfWeek(currentTimeInTimeZone, { weekStartsOn }).toISOString()
  const endOfThisWeek = endOfWeek(currentTimeInTimeZone, { weekStartsOn }).toISOString()

  return { startOfThisWeek, endOfThisWeek }
}

export function getDurationMinutes(startTime: Date, endTime: Date): number {
  return differenceInMinutes(endTime, startTime)
}

export function getThisWeekTotalHours(tasks: TaskWithTags[]): string {
  let totalMinutes = 0

  for (const { startTime, endTime } of tasks) {
    if (!startTime || !endTime) {
      continue
    }

    totalMinutes += getDurationMinutes(startTime, endTime)
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes}m`
}
