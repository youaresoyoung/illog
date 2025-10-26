import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
import { RightPanel } from './RightPanel'
import { useUIStoreState } from '../../stores/useUIStore'

export const Layout = () => {
  const { isTaskNoteOpen } = useUIStoreState()

  return (
    // TODO: change to Container component
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAF9' }}>
      <LeftPanel />
      <MainContent>
        <Outlet />
      </MainContent>
      {isTaskNoteOpen && <RightPanel />}
    </div>
  )
}
