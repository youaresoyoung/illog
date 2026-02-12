import { useEffect } from 'react'
import { useCrashReportSettings, useSendCrashReport } from './queries'
import { useCrashReportStore } from '../stores/useCrashReportStore'

export const useGlobalErrorHandler = () => {
  const { data: settings } = useCrashReportSettings()
  const { mutate: sendReport } = useSendCrashReport()
  const showCrashDialog = useCrashReportStore((s) => s.showCrashDialog)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorPayload = {
        message: event.error?.message || event.message,
        stack: event.error?.stack
      }

      if (settings?.enabled) {
        sendReport(errorPayload)
      } else {
        showCrashDialog(errorPayload)
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      const errorPayload = {
        message: error.message,
        stack: error.stack
      }

      if (settings?.enabled) {
        sendReport(errorPayload)
      } else {
        showCrashDialog(errorPayload)
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [settings, sendReport, showCrashDialog])
}
