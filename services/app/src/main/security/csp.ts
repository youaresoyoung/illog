import { session } from 'electron'
import { isDev } from '../../config/env'

/**
 * Content Security Policy (CSP) configuration.
 *
 * Dev mode:
 *   - Allows Vite HMR (localhost:5173, unsafe-inline, unsafe-eval)
 *   - Does NOT intercept chrome-extension:// requests so DevTools work normally
 *
 * Production mode:
 *   - Strict policy: no unsafe-inline/eval for scripts
 *   - Only allows Sentry for external connections
 *   - upgrade-insecure-requests enforced
 */
export function setupCSP() {
  const connectSrcParts = ["'self'"]
  connectSrcParts.push('https://*.ingest.sentry.io', 'https://*.ingest.us.sentry.io')

  if (isDev) {
    connectSrcParts.push(
      'http://localhost:5173',
      'ws://localhost:5173',
      'http://127.0.0.1:5173',
      'ws://127.0.0.1:5173'
    )
  }
  const connectSrc = connectSrcParts.join(' ')

  const scriptSrcParts = ["'self'"]
  if (isDev) {
    scriptSrcParts.push("'unsafe-inline'", "'unsafe-eval'")
  }
  const scriptSrc = scriptSrcParts.join(' ')
  const styleSrc = "'self' 'unsafe-inline'"
  const imgSrc = "'self' data: blob:"
  const fontSrc = "'self' data:"
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    `connect-src ${connectSrc}`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `font-src ${fontSrc}`,
    `img-src ${imgSrc}`,
    "frame-src 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ]

  if (!isDev) {
    directives.push('upgrade-insecure-requests')
  }

  const cspString = directives.join('; ')

  try {
    // Only apply CSP to http/https and file:// URLs.
    // chrome-extension:// and devtools:// are excluded so DevTools extensions
    // can load their own resources without being blocked.
    const filter = isDev
      ? { urls: ['http://*/*', 'https://*/*', 'file://*'] }
      : { urls: ['https://*/*', 'file://*'] }

    session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [cspString]
        }
      })
    })

    if (isDev) {
      console.log('[CSP] Dev mode — HMR + DevTools allowed')
    } else {
      console.log('[CSP] Production mode — strict policy')
    }
  } catch (e) {
    console.warn('[CSP] setup failed', e)
  }
}
