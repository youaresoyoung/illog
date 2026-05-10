export type ErrorCode =
  | 'DB_ERROR'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'AI_ERROR'
  | 'FEATURE_DISABLED'
  | 'UNKNOWN_ERROR'

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  DB_ERROR: 'Something went wrong while saving. Please try again.',
  NOT_FOUND: 'The requested item could not be found.',
  VALIDATION_ERROR: 'Invalid input. Please check and try again.',
  AI_ERROR: 'AI reflection is temporarily unavailable. Please try again later.',
  FEATURE_DISABLED: 'This feature requires a Pro plan.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export interface SerializedError {
  __appError: true
  message: string
  code: ErrorCode
}

export const APP_ERROR_DELIMITER = '__APP_ERROR__'

export function classifyError(error: unknown): ErrorCode {
  if (error instanceof AppError) return error.code

  if (error instanceof Error) {
    const msg = error.message.toLowerCase()

    if (msg.includes('sqlite') || msg.includes('database') || msg.includes('constraint')) {
      return 'DB_ERROR'
    }
    if (msg.includes('not found') || msg.includes('no result')) {
      return 'NOT_FOUND'
    }
    if (msg.includes('invalid') || msg.includes('required') || msg.includes('validation')) {
      return 'VALIDATION_ERROR'
    }
    if (msg.includes('gemini') || msg.includes('openai') || msg.includes('ai reflection')) {
      return 'AI_ERROR'
    }
    if (msg.includes('pro plan') || msg.includes('feature is not available')) {
      return 'FEATURE_DISABLED'
    }
  }

  return 'UNKNOWN_ERROR'
}

export function serializeError(error: unknown): SerializedError {
  const code = classifyError(error)
  const message = error instanceof Error ? error.message : String(error)

  return { __appError: true, message, code }
}

export function deserializeError(error: unknown): AppError {
  // Electron wraps IPC errors in an Error with the original message
  if (error instanceof Error) {
    // Extract serialized error JSON using delimiter (safe for messages containing any characters)
    const idx = error.message.indexOf(APP_ERROR_DELIMITER)
    if (idx !== -1) {
      try {
        const jsonStr = error.message.slice(idx + APP_ERROR_DELIMITER.length)
        const parsed = JSON.parse(jsonStr) as SerializedError
        if (parsed.__appError) {
          return new AppError(parsed.message, parsed.code)
        }
      } catch {
        // Not our serialized error, fall through
      }
    }

    const code = classifyError(error)
    return new AppError(error.message, code, error)
  }

  return new AppError(String(error), 'UNKNOWN_ERROR', error)
}

export function getUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    return ERROR_MESSAGES[error.code]
  }

  if (error instanceof Error) {
    const code = classifyError(error)
    return ERROR_MESSAGES[code]
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR
}
