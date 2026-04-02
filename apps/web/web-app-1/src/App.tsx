import { RouterProvider } from '@repo/router'
import { router } from './routes.config'

export default function App() {
  return <RouterProvider router={router} />
}
