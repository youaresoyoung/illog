'use client'

import { useEffect, useState } from 'react'

export type Platform =
  | 'mac-arm'
  | 'mac-intel'
  | 'mac'
  | 'windows'
  | 'linux'
  | 'ios'
  | 'android'
  | 'unknown'

async function detectPlatform(): Promise<Platform> {
  const ua = navigator.userAgent.toLowerCase()

  if (/android/.test(ua)) return 'android'
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'

  if (/macintosh|mac os/.test(ua)) {
    try {
      if ('userAgentData' in navigator) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uaData = (navigator as any).userAgentData
        if (uaData && typeof uaData.getHighEntropyValues === 'function') {
          const highEntropyValues = await uaData.getHighEntropyValues(['architecture'])
          if (highEntropyValues.architecture) {
            const arch = highEntropyValues.architecture.toLowerCase()
            if (arch === 'arm' || arch === 'arm64') return 'mac-arm'
            if (arch === 'x86' || arch === 'x86_64') return 'mac-intel'
          }
        }
      }

      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          if (renderer && /apple/i.test(renderer)) return 'mac-arm'
          if (renderer && /intel/i.test(renderer)) return 'mac-intel'
        }
      }
    } catch (error) {
      console.warn('[PlatformDetect] Error detecting Mac architecture:', error)
    }
    return 'mac'
  }

  if (/windows/.test(ua)) return 'windows'
  if (/linux/.test(ua)) return 'linux'

  return 'unknown'
}

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform | null>(null)

  useEffect(() => {
    detectPlatform().then(setPlatform)
  }, [])

  const isMobile = platform === 'ios' || platform === 'android'
  const isMac = platform === 'mac' || platform === 'mac-arm' || platform === 'mac-intel'

  return { platform, isMobile, isMac }
}
