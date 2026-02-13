'use client'

import { useCallback } from 'react'
import type { EventData } from '@illog/analytics'

export function useUmami() {
  const track = useCallback((eventName: string, data?: EventData) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(eventName, data)
    }
  }, [])

  return { track }
}
