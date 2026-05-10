import { useCallback, useEffect } from 'react'

type EventData = Record<string, string | number | boolean>

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, data?: EventData) => {
    window.api?.analytics?.track(eventName, data)
  }, [])

  const trackPageView = useCallback((url: string, title?: string) => {
    window.api?.analytics?.pageView(url, title)
  }, [])

  return { trackEvent, trackPageView }
}

export function usePageView(pageName: string) {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView(`/${pageName}`, pageName)
  }, [pageName, trackPageView])
}
