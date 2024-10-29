import { lazy, Suspense } from 'react'
const Log = lazy(() => import('../views/log/index'))
const Chat = lazy(() => import('../views/chat/index'))
const Home = lazy(() => import('../views/index'))
const load = (Comp:any) => {
  return (
    <Suspense >
      <Comp />
    </Suspense>
  )
}

export const constantRoutes = [
  {
    path: '/',
    name: '/',
    element: load(Chat)
  },
  {
    path: '/log',
    name: '/',
    element: load(Log)
  },
  {
    path: '/chat',
    name: '/',
    element: load(Chat)
  }
]
