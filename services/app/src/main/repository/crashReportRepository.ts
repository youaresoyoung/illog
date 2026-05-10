import { eq } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from '../database/schema'
import { appSettings } from '../database/schema'
import { randomUUID } from 'crypto'
import type { CrashReportSettings } from '../../shared/types'

/**
 * crash_report_enabled: Whether crash report is enabled (0/1)
 * anonymous_id: Anonymous user identification UUID
 * onboarding_completed: Whether onboarding (first run setup) is completed (0/1)
 */
const KEYS = {
  CRASH_REPORT_ENABLED: 'crash_report_enabled',
  ANONYMOUS_ID: 'anonymous_id',
  ONBOARDING_COMPLETED: 'onboarding_completed'
} as const

export class CrashReportRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  getSettings(): CrashReportSettings {
    const enabledRow = this.db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, KEYS.CRASH_REPORT_ENABLED))
      .get()

    let anonymousIdRow = this.db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, KEYS.ANONYMOUS_ID))
      .get()

    // NOTE: On the first call, it automatically creates default values (OFF) and an anonymous UUID.
    if (!anonymousIdRow) {
      const newId = randomUUID()
      this.db
        .insert(appSettings)
        .values({
          key: KEYS.ANONYMOUS_ID,
          value: newId,
          updatedAt: new Date()
        })
        .run()
      anonymousIdRow = { key: KEYS.ANONYMOUS_ID, value: newId, updatedAt: new Date() }
    }

    return {
      enabled: enabledRow?.value === '1',
      anonymousId: anonymousIdRow.value
    }
  }

  isOnboardingCompleted(): boolean {
    const row = this.db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, KEYS.ONBOARDING_COMPLETED))
      .get()

    return row?.value === '1'
  }

  completeOnboarding(): void {
    this.db
      .insert(appSettings)
      .values({
        key: KEYS.ONBOARDING_COMPLETED,
        value: '1',
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { value: '1', updatedAt: new Date() }
      })
      .run()
  }

  updateEnabled(enabled: boolean): CrashReportSettings {
    const value = enabled ? '1' : '0'

    this.db
      .insert(appSettings)
      .values({
        key: KEYS.CRASH_REPORT_ENABLED,
        value,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { value, updatedAt: new Date() }
      })
      .run()

    return this.getSettings()
  }
}
