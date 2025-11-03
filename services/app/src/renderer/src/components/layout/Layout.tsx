import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
import { RightPanel } from './RightPanel'
import { useUIStoreState, useUIStoreActions } from '../../stores/useUIStore'
import { Box, Overlay } from '@illog/ui'

export const Layout = () => {
  const { isTaskNoteOpen, currentTaskId } = useUIStoreState()
  const { closeTaskNote } = useUIStoreActions()

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

      <Overlay
        isOpen={isTaskNoteOpen && !!currentTaskId}
        onClose={closeTaskNote}
        animation="slideRight"
      >
        {currentTaskId && <RightPanel taskId={currentTaskId} />}
      </Overlay>
    </Box>
  )
}
