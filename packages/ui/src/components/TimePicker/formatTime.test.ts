import { describe, expect, it } from 'vitest'
import { formatTime, formatDate, formatDay, toDateTimeLocalValue } from './formatTime'

describe('formatTime', () => {
  it('formats time without minutes correctly', () => {
    const date = new Date('2024-01-15T15:00:00')
    const result = formatTime(date)

    expect(result).toBe('3pm')
  })

  it('formats time with minutes correctly', () => {
    const date = new Date('2024-01-15T15:30:00')
    const result = formatTime(date)

    expect(result).toBe('3:30pm')
  })

  it('formats AM time correctly', () => {
    const date = new Date('2024-01-15T09:00:00')
    const result = formatTime(date)

    expect(result).toBe('9am')
  })

  it('formats midnight correctly', () => {
    const date = new Date('2024-01-15T00:00:00')
    const result = formatTime(date)

    expect(result).toBe('12am')
  })

  it('formats noon correctly', () => {
    const date = new Date('2024-01-15T12:00:00')
    const result = formatTime(date)

    expect(result).toBe('12pm')
  })

  it('formats time with single digit minutes', () => {
    const date = new Date('2024-01-15T14:05:00')
    const result = formatTime(date)

    expect(result).toBe('2:05pm')
  })
})

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15T12:00:00')
    const result = formatDate(date)

    expect(result).toBe('Jan 15')
  })

  it('formats single digit day correctly', () => {
    const date = new Date('2024-01-05T12:00:00')
    const result = formatDate(date)

    expect(result).toBe('Jan 5')
  })

  it('formats different months correctly', () => {
    const date = new Date('2024-12-25T12:00:00')
    const result = formatDate(date)

    expect(result).toBe('Dec 25')
  })
})

describe('formatDay', () => {
  it('formats weekday correctly', () => {
    const date = new Date('2024-01-15T12:00:00') // Monday
    const result = formatDay(date)

    expect(result).toBe('Mon')
  })

  it('formats different weekdays correctly', () => {
    const friday = new Date('2024-01-19T12:00:00')
    expect(formatDay(friday)).toBe('Fri')

    const sunday = new Date('2024-01-21T12:00:00')
    expect(formatDay(sunday)).toBe('Sun')
  })
})

describe('toDateTimeLocalValue', () => {
  it('converts ISO string to datetime-local format', () => {
    const result = toDateTimeLocalValue('2024-01-15T15:30:00')

    expect(result).toBe('2024-01-15T15:30')
  })

  it('returns empty string for null input', () => {
    const result = toDateTimeLocalValue(null)

    expect(result).toBe('')
  })

  it('pads single digit months correctly', () => {
    const result = toDateTimeLocalValue('2024-01-05T09:05:00')

    expect(result).toBe('2024-01-05T09:05')
  })

  it('pads single digit days correctly', () => {
    const result = toDateTimeLocalValue('2024-12-01T12:00:00')

    expect(result).toBe('2024-12-01T12:00')
  })

  it('pads single digit hours correctly', () => {
    const result = toDateTimeLocalValue('2024-06-15T05:30:00')

    expect(result).toBe('2024-06-15T05:30')
  })

  it('pads single digit minutes correctly', () => {
    const result = toDateTimeLocalValue('2024-06-15T15:05:00')

    expect(result).toBe('2024-06-15T15:05')
  })

  it('handles midnight correctly', () => {
    const result = toDateTimeLocalValue('2024-01-15T00:00:00')

    expect(result).toBe('2024-01-15T00:00')
  })
})
