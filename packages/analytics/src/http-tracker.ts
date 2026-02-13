import type { TrackerConfig, EventData, UmamiPayload, ITracker } from './types'

const SEND_ENDPOINT = '/api/send'
const FLUSH_INTERVAL_MS = 5_000
const MAX_QUEUE_SIZE = 50

export class HttpTracker implements ITracker {
  private queue: UmamiPayload[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private enabled = false
  private hostname: string
  private language: string
  private screen: string

  constructor(private config: TrackerConfig) {
    this.hostname = 'electron-app'
    this.language = 'en'
    this.screen = '0x0'
  }

  setContext(opts: { hostname?: string; language?: string; screen?: string }): void {
    if (opts.hostname) this.hostname = opts.hostname
    if (opts.language) this.language = opts.language
    if (opts.screen) this.screen = opts.screen
  }

  enable(): void {
    this.enabled = true
    if (!this.flushTimer) {
      this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS)
    }
  }

  disable(): void {
    this.enabled = false
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    this.queue = []
  }

  isEnabled(): boolean {
    return this.enabled
  }

  track(eventName: string, data?: EventData): void {
    if (!this.enabled) return

    this.enqueue({
      type: 'event',
      payload: {
        hostname: this.hostname,
        language: this.language,
        referrer: '',
        screen: this.screen,
        title: eventName,
        url: '/',
        website: this.config.websiteId,
        name: eventName,
        data
      }
    })
  }

  pageView(url: string, title?: string): void {
    if (!this.enabled) return

    this.enqueue({
      type: 'event',
      payload: {
        hostname: this.hostname,
        language: this.language,
        referrer: '',
        screen: this.screen,
        title: title ?? url,
        url,
        website: this.config.websiteId
      }
    })
  }

  private enqueue(payload: UmamiPayload): void {
    this.queue.push(payload)
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      this.flush()
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return

    const batch = this.queue.splice(0)

    const sendPromises = batch.map((payload) =>
      fetch(`${this.config.host}${SEND_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': this.config.userAgent ?? 'illog-electron'
        },
        body: JSON.stringify(payload)
      }).catch((err) => {
        console.warn('[analytics] Failed to send event:', err.message)
      })
    )

    await Promise.allSettled(sendPromises)
  }

  async shutdown(): Promise<void> {
    this.disable()
    await this.flush()
  }
}
