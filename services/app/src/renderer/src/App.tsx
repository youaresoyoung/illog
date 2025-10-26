import { createHashRouter, RouterProvider } from 'react-router'
import { Layout } from './components/layout/Layout'
import { Today } from './pages/Today'
import { ThisWeek } from './pages/ThisWeek'
import { Reflection } from './pages/Reflection'
import { ThemeProvider } from './context/ThemeContext'
import { NavProvider } from '@illog/ui'
import { PAGE_LIST } from './constant/nav'
import { QueryProvider } from './providers/QueryProvider'

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
      {
        path: 'reflection',
        element: <Reflection />
      }
    ]
  }
])

function App(): React.JSX.Element {
  return (
    <QueryProvider>
      <ThemeProvider>
        <NavProvider list={PAGE_LIST} defaultActiveId={PAGE_LIST[0].id}>
          <RouterProvider router={router} />
        </NavProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
