import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
import { RightPanel } from './RightPanel'
import { useTaskStore } from '../../stores/taskStore'
import { useTagStore } from '../../stores/useTagStore'
import { useEffect } from 'react'

export const Layout = () => {
  const { isTaskNoteOpen } = useTaskStore()
  const { loadTags } = useTagStore()

  useEffect(() => {
    loadTags()
  }, [loadTags])

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
