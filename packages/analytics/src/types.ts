export interface TrackerConfig {
  host: string
  websiteId: string
  /** User-Agent string for HTTP tracker */
  userAgent?: string
}

export interface EventData {
  [key: string]: string | number | boolean
}

export interface PageViewPayload {
  url: string
  referrer?: string
  title?: string
}

export interface EventPayload {
  name: string
  data?: EventData
}

/**
 * Umami Send API payload
 * @see https://umami.is/docs/api/sending-stats
 */
export interface UmamiPayload {
  type: 'event'
  payload: {
    hostname: string
    language: string
    referrer: string
    screen: string
    title: string
    url: string
    website: string
    name?: string
    data?: EventData
  }
}

export interface ITracker {
  track(eventName: string, data?: EventData): void
  pageView(url: string, title?: string): void
}
