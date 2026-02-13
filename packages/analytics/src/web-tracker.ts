import type { EventData, ITracker } from './types'

declare global {
  interface Window {
    umami?: {
      track: {
        (eventName: string, data?: EventData): void
        (
          callback: (props: {
            hostname: string
            language: string
            referrer: string
            screen: string
            title: string
            url: string
            website: string
          }) => EventData
        ): void
      }
    }
  }
}

export class WebTracker implements ITracker {
  track(eventName: string, data?: EventData): void {
    if (typeof window === 'undefined' || !window.umami) return
    window.umami.track(eventName, data)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pageView(_url: string, _title?: string): void {
    // Umami script handles page views automatically
  }
}
