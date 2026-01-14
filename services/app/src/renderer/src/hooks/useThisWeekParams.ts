import { useMemo } from 'react'
import { useUserStore } from '../stores/useUserStore'
import { getThisWeekDateRange } from '../utils/time'

export function useThisWeekParams() {
  const { timeZone } = useUserStore()

  const { startOfThisWeek, endOfThisWeek } = useMemo(
    () => getThisWeekDateRange(timeZone),
    [timeZone]
  )

  return {
    startTime: startOfThisWeek,
    endTime: endOfThisWeek,
    timeZone
  }
}
