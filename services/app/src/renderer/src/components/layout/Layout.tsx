import { Outlet } from 'react-router'
import { LeftPanel } from './LeftPanel'
import { MainContent } from './MainContent'
// import { RightPanel } from './RightPanel'

export const Layout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LeftPanel />
      <MainContent>
        <Outlet />
      </MainContent>
      {/* <RightPanel /> */}
    </div>
  )
}
