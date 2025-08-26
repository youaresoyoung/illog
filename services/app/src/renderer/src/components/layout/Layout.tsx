import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
import { RightPanel } from './RightPanel'
import { useTaskStore } from '../../stores/taskStore'

export const Layout = () => {
  const { isTaskNoteOpen } = useTaskStore()

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LeftPanel />
      <MainContent>
        <Outlet />
      </MainContent>
      {isTaskNoteOpen && <RightPanel />}
    </div>
  )
}
