import { Button, Dialog, Stack, Text } from '@illog/ui'
import { useEffect, useState } from 'react'

interface UpdateInfo {
  releaseNotes?: string
  releaseName?: string
}

export function UpdateDialog() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [isDownloaded, setIsDownloaded] = useState(false)

  useEffect(() => {
    const unsubscribeAvailable = window.api.events.onUpdateAvailable(() => {})

    const unsubscribeDownloaded = window.api.events.onUpdateDownloaded((info: UpdateInfo) => {
      setUpdateInfo(info)
      setIsDownloaded(true)
    })

    return () => {
      unsubscribeAvailable()
      unsubscribeDownloaded()
    }
  }, [])

  const handleUpdate = async () => {
    await window.api.updater.quitAndInstall()
  }

  const handleCancel = () => {
    setIsDownloaded(false)
    setUpdateInfo(null)
  }

  if (!isDownloaded) {
    return null
  }

  return (
    <Dialog isOpen={isDownloaded} onClose={handleCancel} ariaLabel="Update Available">
      <Dialog.Title>Update Available</Dialog.Title>
      <Dialog.Content>
        <Stack gap="400" textAlign="center">
          {updateInfo?.releaseName && (
            <Text as="p" textStyle="bodyBase" color="textBrandTertiary">
              {updateInfo.releaseName}
            </Text>
          )}
          <Text as="p" textStyle="bodyBase" color="textBrandTertiary">
            A new version has been downloaded. Would you like to update now?
          </Text>
          {updateInfo?.releaseNotes && (
            <Text as="p" textStyle="bodyBase" color="textBrandTertiary">
              <pre className="whitespace-pre-wrap">{updateInfo.releaseNotes}</pre>
            </Text>
          )}
        </Stack>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="primary" onClick={handleUpdate} isFullWidth>
          Update Now
        </Button>
        <Button variant="secondary" onClick={handleCancel} isFullWidth>
          Later
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
