import { Component, ReactNode } from 'react'
import { useCrashReportStore } from '../stores/useCrashReportStore'
import { Button, Stack, Text } from '@illog/ui'

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

  handleReload = () => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Stack height="100vh" gap="400" p="1200" textAlign="center">
          <Text textStyle="bodyBase">Something went wrong</Text>
          <Text textStyle="bodyBase" color="textDefaultSecondary">
            An unexpected error occurred. Please reload the app to continue.
          </Text>
          <Button onClick={this.handleReload} variant="primary">
            Reload App
          </Button>
        </Stack>
      )
    }
    return this.props.children
  }
}
