/**
 * @example
 * formatHour(0) // '12 AM'
 * formatHour(12) // '12 PM'
 */
export function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}

/**
 * @example
 * formatTimeLabel(new Date('2024-01-01T00:00:00')) // '12:00 AM'
 * formatTimeLabel(new Date('2024-01-01T12:30:00')) // '12:30 PM'
 * formatTimeLabel(new Date('2024-01-01T23:45:00')) // '11:45 PM'
 */
export function formatTimeLabel(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${displayHour}:${displayMinutes} ${ampm}`
}

/**
 * @example
 * getMinutesFromMidnight(new Date('2024-01-01T00:00:00')) // 12:00 AM -> 0
 * getMinutesFromMidnight(new Date('2024-01-01T12:30:00')) // 12:30 PM -> 750
 * getMinutesFromMidnight(new Date('2024-01-01T23:45:00')) // 11:45 PM -> 1425
 */
export function getMinutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}
