import { Dialog, Button, Text, Stack, Box } from '@illog/ui'
import { useCrashReportStore } from '../stores/useCrashReportStore'
import { useSendCrashReport } from '../hooks/queries'

export const CrashReportDialog = () => {
  const isOpen = useCrashReportStore((s) => s.isCrashDialogOpen)
  const pendingCrashError = useCrashReportStore((s) => s.pendingCrashError)
  const closeCrashDialog = useCrashReportStore((s) => s.closeCrashDialog)
  const { mutate: sendReport } = useSendCrashReport()

  const handleSendReport = () => {
    if (pendingCrashError) {
      sendReport(pendingCrashError)
    }
    closeCrashDialog()
  }

  return (
    <Dialog isOpen={isOpen} onClose={closeCrashDialog} role="alertdialog" ariaLabel="Crash Report">
      <Dialog.Title>A crash has occurred</Dialog.Title>
      <Dialog.Description>
        Would you like to send an anonymous crash report to help improve the app?
      </Dialog.Description>
      <Dialog.Content>
        <Stack gap="200">
          <Text as="p" textStyle="caption" color="textBrandTertiary">
            Information sent:
          </Text>
          <Box as="ul" pl="200">
            <Text as="li" textStyle="caption" color="textBrandTertiary">
              - App version and operating system information
            </Text>
            <Text as="li" textStyle="caption" color="textBrandTertiary">
              - Crash location (stack trace)
            </Text>
            <Text as="li" textStyle="caption" color="textBrandTertiary">
              - Crash time
            </Text>
          </Box>
          <Text as="p" textStyle="caption" color="textBrandTertiary">
            Personal identifiable information, local data, and file paths are not collected.
          </Text>
        </Stack>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="secondary" onClick={closeCrashDialog} isFullWidth>
          Don&apos;t send
        </Button>
        <Button variant="primary" onClick={handleSendReport} isFullWidth>
          Send report
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
