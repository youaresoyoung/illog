import { Dialog, Button, Text, Stack, Box, Divider } from '@illog/ui'
import { useCrashReportSettings, useUpdateCrashReportSettings } from '../hooks/queries'

type SettingsDialogProps = {
  isOpen: boolean
  onClose: () => void
  isOnboarding?: boolean
}

export const SettingsDialog = ({ isOpen, onClose, isOnboarding = false }: SettingsDialogProps) => {
  const { data: settings, isLoading } = useCrashReportSettings()
  const { mutate: updateEnabled } = useUpdateCrashReportSettings()

  const handleToggle = () => {
    if (settings) {
      updateEnabled(!settings.enabled)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel={isOnboarding ? 'Welcome' : 'Settings'}>
      <Dialog.Title>{isOnboarding ? 'Welcome to illog' : 'Settings'}</Dialog.Title>
      <Dialog.Content>
        <Stack gap="400">
          {isOnboarding && (
            <Text as="p" textStyle="bodyBase" color="textBrandTertiary">
              Before getting started, please review the anonymous error reporting settings to help
              improve the app.
            </Text>
          )}

          <Stack gap="200">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text as="span" textStyle="bodyStrong">
                Anonymous Error Reporting
              </Text>
              {/* TODO: create toggle switch component */}
              <Box
                as="button"
                onClick={handleToggle}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="44px"
                height="24px"
                rounded="full"
                cursor="pointer"
                bg={settings?.enabled ? 'backgroundBrandDefault' : 'backgroundBrandTertiary'}
                style={{
                  border: 'none',
                  transition: 'background-color 0.2s ease',
                  position: 'relative',
                  opacity: isLoading ? 0.5 : 1,
                  pointerEvents: isLoading ? 'none' : 'auto'
                }}
                aria-label={`Anonymous Error Reporting ${settings?.enabled ? 'Disable' : 'Enable'}`}
                aria-checked={settings?.enabled ?? false}
                role="switch"
              >
                <Box
                  width="18px"
                  height="18px"
                  rounded="full"
                  backgroundColor="backgroundBrandSecondary"
                  style={{
                    position: 'absolute',
                    left: settings?.enabled ? '22px' : '4px',
                    transition: 'left 0.2s ease'
                  }}
                />
              </Box>
            </Box>

            <Text as="p" textStyle="caption" color="textBrandTertiary">
              Error information that occurs during app usage is collected anonymously to help
              improve app stability.
            </Text>
          </Stack>

          <Divider />

          <Stack gap="200">
            <Text as="p" textStyle="caption" color="textBrandTertiary">
              Collected Information:
            </Text>
            <Box as="ul" pl="200">
              <Text as="li" textStyle="caption" color="textBrandTertiary">
                - App version, Electron version
              </Text>
              <Text as="li" textStyle="caption" color="textBrandTertiary">
                - Operating system type and version
              </Text>
              <Text as="li" textStyle="caption" color="textBrandTertiary">
                - System architecture (x64, arm64, etc.)
              </Text>
              <Text as="li" textStyle="caption" color="textBrandTertiary">
                - Error stack traces
              </Text>
              <Text as="li" textStyle="caption" color="textBrandTertiary">
                - Error occurrence timestamps
              </Text>
            </Box>
          </Stack>

          <Stack gap="200">
            <Text as="p" textStyle="caption" color="textBrandTertiary">
              Information not collected:
            </Text>
            <Box as="ul" pl="200">
              <Text as="li" textStyle="caption" color="textBrandTertiary">
                - Personally identifiable information (email, name, etc.)
              </Text>
              <Text as="li" textStyle="caption" color="textBrandTertiary">
                - Local database contents
              </Text>
              <Text as="li" textStyle="caption" color="textBrandTertiary">
                - Local file paths
              </Text>
            </Box>
          </Stack>

          <Text as="p" textStyle="caption" color="textBrandTertiary">
            This setting can be changed at any time, and collection will stop immediately when
            disabled. Error reports are used solely for app improvement purposes and are identified
            only by a randomly generated anonymous ID.
          </Text>
        </Stack>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant={'primary'} onClick={onClose} isFullWidth>
          {isOnboarding ? 'Get Started' : 'Close'}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
