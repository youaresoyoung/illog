/**
 *
 * Formats a Date object into a 12-hour time string.
 * @param date - The Date object to format
 * @returns Formatted time string (e.g., "3PM", "3:30PM")
 */
export function formatTime(date: Date): string {
  return date
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: date.getMinutes() > 0 ? '2-digit' : undefined,
      hour12: true
    })
    .toLowerCase()
    .replace(' ', '')
}

/**
 *
 * Formats a Date object into a short date string.
 * @param date - The Date object to format
 * @returns Formatted date string (e.g., "Jan 5")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

/**
 *
 * Formats a Date object into a short weekday string.
 * @param date - The Date object to format
 * @returns Formatted day string (e.g., "Mon", "Tue")
 */
export function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short'
  })
}

/**
 *
 * Converts an ISO date string to a value suitable for a datetime-local input.
 * @param isoString - The ISO date string
 * @returns Formatted datetime-local string (e.g., "2023-01-05T15:30")
 */
export function toDateTimeLocalValue(isoString: string | null): string {
  if (!isoString) return ''

  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}
