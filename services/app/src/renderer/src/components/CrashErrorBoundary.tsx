import { Component, ReactNode } from 'react'
import { useCrashReportStore } from '../stores/useCrashReportStore'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class CrashErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error): void {
    const errorPayload = { message: error.message, stack: error.stack }

    window.api.crashReport.getSettings().then((settings) => {
      if (settings.enabled) {
        window.api.crashReport.sendReport(errorPayload)
      } else {
        useCrashReportStore.getState().showCrashDialog(errorPayload)
      }
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}
