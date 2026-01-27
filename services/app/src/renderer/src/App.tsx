import { createHashRouter, RouterProvider } from 'react-router'
import { Layout } from './components/layout/Layout'
import { Today } from './pages/Today'
import { ThisWeek } from './pages/ThisWeek'
import { ThemeProvider } from './context/ThemeContext'
import { QueryProvider } from './providers/QueryProvider'
import { History } from './pages/History'

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

function App(): React.JSX.Element {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
