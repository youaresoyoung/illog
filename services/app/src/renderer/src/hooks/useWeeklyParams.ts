import { useState, useMemo } from 'react'
import { addWeeks, startOfWeek, endOfWeek } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useUserStore } from '../stores/useUserStore'

// Note: in the future, user can choose week's start (Sun or Mon)
type WEEK_START = 0 | 1

export function useWeeklyParams() {
  const { timeZone } = useUserStore()
  const [weekOffset, setWeekOffset] = useState(0) // 0 = current week, -1 = last week, 1 = next week

  const { startTime, endTime } = useMemo(() => {
    const now = new Date()
    const weekStartsOn: WEEK_START = 1

    const currentTimeInTimeZone = toZonedTime(now, timeZone)
    const targetDate = addWeeks(currentTimeInTimeZone, weekOffset)

    const startOfTargetWeek = startOfWeek(targetDate, { weekStartsOn }).toISOString()
    const endOfTargetWeek = endOfWeek(targetDate, { weekStartsOn }).toISOString()

    return {
      startTime: startOfTargetWeek,
      endTime: endOfTargetWeek
    }
  }, [timeZone, weekOffset])

  const goToPreviousWeek = () => {
    setWeekOffset((prev) => prev - 1)
  }

  const goToNextWeek = () => {
    setWeekOffset((prev) => prev + 1)
  }

  const isCurrentWeek = weekOffset === 0

  return {
    startTime,
    endTime,
    timeZone,
    weekOffset,
    goToPreviousWeek,
    goToNextWeek,
    isCurrentWeek
  }
}
