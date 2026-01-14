import { Navigation, Text } from '@illog/ui'
import { useUIStoreActions, useUIStoreState } from '../../stores/useUIStore'
import { useLocation } from 'react-router'
import { useEffect } from 'react'
import { PAGE_LIST, PageId } from '../../constant/nav'

export const LeftPanel = () => {
  const { activeTab } = useUIStoreState()
  const { setActiveTab } = useUIStoreActions()
  const location = useLocation()

  useEffect(() => {
    const currentPage = PAGE_LIST.find((page) => page.to === location.pathname)
    if (currentPage && currentPage.id !== activeTab) {
      setActiveTab(currentPage.id)
    }
  }, [location.pathname, activeTab, setActiveTab])

  return (
    <Navigation.Root<PageId> value={activeTab} onValueChange={setActiveTab}>
      <Navigation.Container>
        <Text as="h1" textStyle="heading">
          illog
        </Text>
        <Navigation.List mt="1200">
          {PAGE_LIST.map((page) => (
            <Navigation.Item key={page.id} value={page.id} to={page.to} iconName={page.iconName}>
              {page.label}
            </Navigation.Item>
          ))}
        </Navigation.List>
      </Navigation.Container>
    </Navigation.Root>
  )
}
