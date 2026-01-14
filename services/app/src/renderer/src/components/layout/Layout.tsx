import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
import { RightPanel } from './RightPanel'
// import { useUIStoreState, useUIStoreActions } from '../../stores/useUIStore'
import { Box, Overlay } from '@illog/ui'
import { useUIStore } from '../../stores/useUIStore'

export const Layout = () => {
  const isTaskNoteOpen = useUIStore((s) => s.isTaskNoteOpen)
  const currentTaskId = useUIStore((s) => s.currentTaskId)
  const closeTaskNote = useUIStore((s) => s.closeTaskNote)

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
