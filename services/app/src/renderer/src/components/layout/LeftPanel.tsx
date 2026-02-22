import { Navigation, Icon, Stack, Inline, Box } from '@illog/ui'
import { memo, useEffect, useState } from 'react'
import { PAGE_LIST } from '../../constant/nav'
import { SettingsDialog } from '../SettingsDialog'
import logoLightMode from '../../assets/images/light/logo@x2.png'
import logoDarkMode from '../../assets/images/dark/logo@x2.png'

export const LeftPanel = memo(() => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  // TODO: move dark mode state to zustand so that it can be used in other places like TaskNote for dark mode support
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <Navigation.Container>
      <Inline justify="space-between" align="center">
        <Box
          as="img"
          src={isDarkMode ? logoDarkMode : logoLightMode}
          alt="illog logo"
          width={159}
          height={64}
        />
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
