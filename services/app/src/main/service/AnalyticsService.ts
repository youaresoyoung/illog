import { app } from 'electron'
import { HttpTracker } from '@illog/analytics'
import type { EventData } from '@illog/analytics'
import { CrashReportService } from './CrashReportService'
import log from 'electron-log'

/**
 * Analytics service for the Electron app.
 * Uses HttpTracker to send events to Umami Cloud.
 * Shares opt-in state with CrashReportService (Sentry).
 */
export class AnalyticsService {
  private tracker: HttpTracker

  constructor(
    private crashReportService: CrashReportService,
    config: { host: string; websiteId: string }
  ) {
    this.tracker = new HttpTracker({
      host: config.host,
      websiteId: config.websiteId,
      userAgent: `illog/${app.getVersion()} (${process.platform}; ${process.arch})`
    })

    this.tracker.setContext({
      hostname: 'illog-electron',
      language: app.getLocale(),
      screen: '0x0' // will be updated from renderer if needed
    })

    this.applySettings()
  }

  /** Sync analytics enabled state with crash report opt-in */
  applySettings(): void {
    if (this.crashReportService.isActive()) {
      this.tracker.enable()
      log.info('[analytics] Enabled (crash report opt-in is active)')
    } else {
      this.tracker.disable()
      log.info('[analytics] Disabled (crash report opt-in is not active)')
    }
  }

  track(eventName: string, data?: EventData): void {
    this.tracker.track(eventName, data)
  }

  pageView(url: string, title?: string): void {
    this.tracker.pageView(url, title)
  }

  async shutdown(): Promise<void> {
    await this.tracker.shutdown()
  }
}
