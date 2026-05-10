import { describe, expect, it } from 'vitest'
import {
  AppError,
  classifyError,
  serializeError,
  deserializeError,
  getUserMessage,
  APP_ERROR_DELIMITER
} from './errors'

describe('classifyError', () => {
  it('returns code from AppError directly', () => {
    expect(classifyError(new AppError('test', 'AI_ERROR'))).toBe('AI_ERROR')
  })

  it('classifies sqlite errors as DB_ERROR', () => {
    expect(classifyError(new Error('SQLITE_CONSTRAINT: UNIQUE'))).toBe('DB_ERROR')
  })

  it('classifies database errors as DB_ERROR', () => {
    expect(classifyError(new Error('database is locked'))).toBe('DB_ERROR')
  })

  it('classifies not found errors as NOT_FOUND', () => {
    expect(classifyError(new Error('Task not found'))).toBe('NOT_FOUND')
  })

  it('classifies validation errors', () => {
    expect(classifyError(new Error('Invalid input format'))).toBe('VALIDATION_ERROR')
  })

  it('classifies gemini errors as AI_ERROR', () => {
    expect(classifyError(new Error('Gemini API rate limit exceeded'))).toBe('AI_ERROR')
  })

  it('classifies pro plan errors as FEATURE_DISABLED', () => {
    expect(classifyError(new Error('This requires a Pro plan'))).toBe('FEATURE_DISABLED')
  })

  it('does NOT misclassify "stream task data" as AI_ERROR', () => {
    expect(classifyError(new Error('Failed to stream task data'))).toBe('UNKNOWN_ERROR')
  })

  it('does NOT misclassify "plan" alone as FEATURE_DISABLED', () => {
    expect(classifyError(new Error('Failed to save plan data'))).toBe('UNKNOWN_ERROR')
  })

  it('returns UNKNOWN_ERROR for non-Error values', () => {
    expect(classifyError('string error')).toBe('UNKNOWN_ERROR')
    expect(classifyError(null)).toBe('UNKNOWN_ERROR')
  })
})

describe('serializeError / deserializeError round-trip', () => {
  it('round-trips an AppError', () => {
    const original = new AppError('Item not found', 'NOT_FOUND')
    const serialized = serializeError(original)

    expect(serialized.__appError).toBe(true)
    expect(serialized.code).toBe('NOT_FOUND')
    expect(serialized.message).toBe('Item not found')

    // Simulate what happens across IPC: safeHandle wraps in delimiter, safeInvoke extracts
    const ipcMessage = `${APP_ERROR_DELIMITER}${JSON.stringify(serialized)}`
    const ipcError = new Error(ipcMessage)
    const deserialized = deserializeError(ipcError)

    expect(deserialized).toBeInstanceOf(AppError)
    expect(deserialized.code).toBe('NOT_FOUND')
    expect(deserialized.message).toBe('Item not found')
  })

  it('handles messages containing } characters', () => {
    const errorWithBraces = new Error('Unexpected token } in JSON at position 5')
    const serialized = serializeError(errorWithBraces)
    const ipcMessage = `${APP_ERROR_DELIMITER}${JSON.stringify(serialized)}`
    const ipcError = new Error(ipcMessage)
    const deserialized = deserializeError(ipcError)

    expect(deserialized).toBeInstanceOf(AppError)
    expect(deserialized.message).toBe('Unexpected token } in JSON at position 5')
  })

  it('falls back to classifyError for non-serialized errors', () => {
    const plainError = new Error('SQLITE_BUSY: database is locked')
    const deserialized = deserializeError(plainError)

    expect(deserialized).toBeInstanceOf(AppError)
    expect(deserialized.code).toBe('DB_ERROR')
  })

  it('handles non-Error values', () => {
    const deserialized = deserializeError('raw string error')

    expect(deserialized).toBeInstanceOf(AppError)
    expect(deserialized.code).toBe('UNKNOWN_ERROR')
    expect(deserialized.message).toBe('raw string error')
  })
})

describe('getUserMessage', () => {
  it('returns correct message for AppError', () => {
    const error = new AppError('db error', 'DB_ERROR')
    expect(getUserMessage(error)).toBe('Something went wrong while saving. Please try again.')
  })

  it('returns correct message for classified Error', () => {
    const error = new Error('SQLITE_ERROR: table not found')
    expect(getUserMessage(error)).toBe('Something went wrong while saving. Please try again.')
  })

  it('returns unknown error message for non-Error', () => {
    expect(getUserMessage(42)).toBe('An unexpected error occurred. Please try again.')
  })
})
