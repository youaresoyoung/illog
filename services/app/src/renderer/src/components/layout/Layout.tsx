import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
import { RightPanel } from './RightPanel'
import { useUIStoreState } from '../../stores/useUIStore'
import { Box } from '@illog/ui'

export const Layout = () => {
  const { isTaskNoteOpen, currentTaskId } = useUIStoreState()

  return (
    <Box
      display="flex"
      minHeight="100vh"
      backgroundColor="backgroundBrandTertiary"
      overflow="hidden"
    >
      <LeftPanel />
      <MainContent>
        <Outlet />
      </MainContent>
      {isTaskNoteOpen && currentTaskId && <RightPanel taskId={currentTaskId} />}
    </Box>
  )
}
