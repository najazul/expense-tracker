import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '#/lib/auth'
import { Toaster } from '#/components/ui/toast'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const isAuth = isAuthenticated()
    if (!isAuth && location.pathname !== '/') {
      throw redirect({ to: '/' })
    }
    if (isAuth && location.pathname === '/') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}
