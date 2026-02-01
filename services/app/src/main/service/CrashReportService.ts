import * as Sentry from '@sentry/electron/main'
import { app } from 'electron'
import { CrashReportRepository } from '../repository/crashReportRepository'
import type { CrashReportSettings } from '../../shared/types'
import { isDev } from '../../utils/utils'

const SENTRY_DSN = process.env.SENTRY_DSN || ''
const SENTRY_DEV_DSN = process.env.SENTRY_DEV_DSN || ''

/**
 * opt-in flag
 * Sentry.init() must be called before app ready, so it is initialized at the module level,
 * but the actual event sending is controlled by this flag.
 * After connecting to the DB, user settings are read to determine true/false.
 */
let sentryEnabled = false

export function initSentryEarly(): void {
  Sentry.init({
    dsn: isDev() ? SENTRY_DEV_DSN : SENTRY_DSN,
    environment: isDev() ? 'development' : 'production',

    // PII(Personally Identifiable Information) collection OFF
    sendDefaultPii: false,

    maxBreadcrumbs: 50,

    // Tracing disabled (crash reports only)
    tracesSampleRate: 0,

    // In beforeSend, it checks the sentryEnabled flag
    beforeSend(event) {
      // Drop events if user has not consented to opt-in or if disabled in development
      if (!sentryEnabled) {
        return null
      }

      // Drop events without release
      if (!event.release) {
        return null
      }

      // Remove file:// URLs
      if (event.request?.url?.startsWith('file://')) {
        delete event.request
      }

      // Remove local path information from stack traces
      if (event.exception?.values) {
        for (const exception of event.exception.values) {
          if (exception.stacktrace?.frames) {
            for (const frame of exception.stacktrace.frames) {
              if (frame.filename && frame.filename.startsWith('/')) {
                const parts = frame.filename.split('/')
                frame.filename = parts[parts.length - 1]
              }
              delete frame.abs_path
            }
          }
        }
      }

      // Remove local DB path information
      if (event.extra) {
        const keysToDelete = Object.keys(event.extra).filter(
          (key) =>
            key.toLowerCase().includes('db') ||
            key.toLowerCase().includes('path') ||
            key.toLowerCase().includes('file')
        )
        for (const key of keysToDelete) {
          delete event.extra[key]
        }
      }

      // Remove personally identifiable information from user data fields
      if (event.user) {
        const anonId = event.user.id
        event.user = { id: anonId }
      }

      // Remove sensitive information from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.filter((breadcrumb) => {
          if (
            breadcrumb.data?.url?.startsWith('file://') ||
            breadcrumb.message?.includes('file://')
          ) {
            return false
          }
          return true
        })
      }

      return event
    }
  })

  // Basic tags setting (can be done before app ready)
  Sentry.setTag('arch', process.arch)
  Sentry.setTag('electron_version', process.versions.electron)
  Sentry.setTag('os', process.platform)
}

/**
 * Sentry  crash report service
 *
 * Created after DB connection to control opt-in flag and manage settings.
 * Sentry.init() itself has already been called in initSentryEarly().
 */
export class CrashReportService {
  constructor(private repo: CrashReportRepository) {}

  /**
   * Reads settings from the DB to determine whether Sentry is enabled.
   * Called after app ready + DB connection.
   */
  applySettings(): void {
    if (isDev()) return

    const settings = this.repo.getSettings()
    sentryEnabled = settings.enabled

    if (settings.enabled) {
      // release tag setting (can only be done after app ready)
      Sentry.setTag('release', `${app.getName()}@${app.getVersion()}`)
      Sentry.setUser({ id: settings.anonymousId })
    }
  }

  getSettings(): CrashReportSettings {
    return this.repo.getSettings()
  }

  isOnboardingCompleted(): boolean {
    return this.repo.isOnboardingCompleted()
  }

  completeOnboarding(): void {
    this.repo.completeOnboarding()
  }

  async updateSettings(enabled: boolean): Promise<CrashReportSettings> {
    const settings = this.repo.updateEnabled(enabled)
    sentryEnabled = enabled

    if (enabled && !isDev()) {
      Sentry.setTag('release', `${app.getName()}@${app.getVersion()}`)
      Sentry.setUser({ id: settings.anonymousId })
    }

    return settings
  }

  sendCrashReport(error: { message: string; stack?: string }): void {
    if (!sentryEnabled) return

    const sentryError = new Error(error.message)
    if (error.stack) {
      sentryError.stack = error.stack
    }
    Sentry.captureException(sentryError)
  }

  async shutdown(): Promise<void> {
    if (sentryEnabled) {
      await Sentry.close(2000)
      sentryEnabled = false
    }
  }

  isActive(): boolean {
    return sentryEnabled
  }
}
