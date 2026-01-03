import { endOfWeek, startOfWeek } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

// Note: in the future, user can choose week's start (Sun or Mon)
type WEEK_START = 0 | 1

export function getThisWeekDateRange(timeZone: string) {
  const now = new Date()
  const weekStartsOn: WEEK_START = 1

  const currentTimeInTimeZone = toZonedTime(now, timeZone)

  const startOfThisWeek = startOfWeek(currentTimeInTimeZone, { weekStartsOn })
  const endOfThisWeek = endOfWeek(currentTimeInTimeZone, { weekStartsOn })

  return { startOfThisWeek, endOfThisWeek }
}
