import { Navigation, Text } from '@illog/ui'
import { memo } from 'react'
import { PAGE_LIST } from '../../constant/nav'

export const LeftPanel = memo(() => {
  return (
    <Navigation.Container>
      <Text as="h1" textStyle="heading">
        illog
      </Text>
      <Navigation.List mt="1200">
        {PAGE_LIST.map((page) => (
          <Navigation.Item key={page.id} to={page.to} iconName={page.iconName}>
            {page.label}
          </Navigation.Item>
        ))}
      </Navigation.List>
    </Navigation.Container>
  )
})

LeftPanel.displayName = 'LeftPanel'
