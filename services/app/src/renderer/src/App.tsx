import { createHashRouter, RouterProvider } from 'react-router'
import { Layout } from './components/layout/Layout'
import { Today } from './pages/Today'
import { ThisWeek } from './pages/ThisWeek'
import { Reflection } from './pages/Reflection'

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
  return <RouterProvider router={router} />
}

export default App
