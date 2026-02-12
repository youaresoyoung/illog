import { createHashRouter, RouterProvider } from 'react-router'
import { Layout } from './components/layout/Layout'
import { Today } from './pages/Today'
import { ThisWeek } from './pages/ThisWeek'
import { ThemeProvider } from './context/ThemeContext'
import { QueryProvider } from './providers/QueryProvider'
import { History } from './pages/History'
import { CrashReportDialog } from './components/CrashReportDialog'
import { CrashErrorBoundary } from './components/CrashErrorBoundary'
import { SettingsDialog } from './components/SettingsDialog'
import { ToastContainer } from './components/Toast/ToastContainer'
import { useOnboardingStatus, useCompleteOnboarding } from './hooks/queries'
import { useGlobalErrorHandler } from './hooks/useGlobalErrorHandler'
import { UpdateDialog } from './components/dialog/UpdateDialog'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Today />
      },
      {
        path: 'this-week',
        element: <ThisWeek />
      },
      // // NOTE: History page is temporarily show up until the reflection page is ready, as they will be merged into one page eventually
      {
        path: 'history',
        element: <History />
      }
      // {
      //   path: 'reflection',
      //   element: <Reflection />
      // }
    ]
  }
])

function AppContent() {
  const { data: isOnboardingCompleted } = useOnboardingStatus()
  const { mutate: completeOnboarding } = useCompleteOnboarding()
  const needsOnboarding = isOnboardingCompleted === false

  useGlobalErrorHandler()

  return (
    <>
      <RouterProvider router={router} />
      <CrashReportDialog />
      <ToastContainer />
      <UpdateDialog />
      <SettingsDialog isOpen={needsOnboarding} onClose={() => completeOnboarding()} isOnboarding />
    </>
  )
}

function App(): React.JSX.Element {
  return (
    <CrashErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </QueryProvider>
    </CrashErrorBoundary>
  )
}

export default App
