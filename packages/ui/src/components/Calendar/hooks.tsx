import { useEffect, useState } from 'react'

/**
 *
 * @param intervalMs The interval in milliseconds at which the current time should be updated. Defaults to 30,000 ms (30 seconds).
 * @returns The current date and time, updated at the specified interval.
 */
export function useCurrentTime(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
