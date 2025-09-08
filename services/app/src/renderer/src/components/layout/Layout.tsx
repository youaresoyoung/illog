import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
import { RightPanel } from './RightPanel'
import { useTaskActions, useTaskState } from '../../stores/useTaskStore'
import { useTagActions } from '../../stores/useTagStore'
import { useEffect } from 'react'

export const Layout = () => {
  const { isTaskNoteOpen } = useTaskState()
  const { loadTasks } = useTaskActions()
  const { loadTags } = useTagActions()

  useEffect(() => {
    loadTasks()
    loadTags()
  }, [loadTags, loadTasks])

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
