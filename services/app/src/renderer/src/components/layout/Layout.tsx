import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
import { RightPanel } from './RightPanel'
import { useTaskStore } from '../../stores/useTaskStore'
import { useTagStore } from '../../stores/useTagStore'
import { useEffect } from 'react'

export const Layout = () => {
  const { isTaskNoteOpen, loadTasks } = useTaskStore()
  const { loadTags } = useTagStore()

  useEffect(() => {
    loadTasks()
    loadTags()
  }, [loadTags, loadTasks])

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#FAFAF9' }}>
      <LeftPanel />
      <MainContent>
        <Outlet />
      </MainContent>
      {isTaskNoteOpen && <RightPanel />}
    </div>
  )
}
