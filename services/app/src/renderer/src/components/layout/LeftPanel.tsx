import { Navigation, Icon, Stack, Inline, Box } from '@illog/ui'
import { memo, useState } from 'react'
import { PAGE_LIST } from '../../constant/nav'
import { SettingsDialog } from '../SettingsDialog'
import logo from '../../assets/images/logo@x2.png'

export const LeftPanel = memo(() => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <Navigation.Container>
      <Inline justify="space-between" align="center">
        <Box as="img" src={logo} alt="illog logo" width={159} height={64} />
        <Stack
          as="button"
          onClick={() => setIsSettingsOpen(true)}
          cursor="pointer"
          p="100"
          aria-label="settings"
        >
          <Icon name="setting" size="small" />
        </Stack>
      </Inline>
      <Navigation.List mt="1200">
        {PAGE_LIST.map((page) => (
          <Navigation.Item key={page.id} to={page.to} iconName={page.iconName}>
            {page.label}
          </Navigation.Item>
        ))}
      </Navigation.List>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </Navigation.Container>
  )
})

LeftPanel.displayName = 'LeftPanel'
