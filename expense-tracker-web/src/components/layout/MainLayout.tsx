import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { getStoredUser } from '#/lib/auth'
import { useAuth } from '#/hooks/useAuth'
import { Receipt, LayoutDashboard, FileText, LogOut } from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  // Prevent double scrolls by locking main body scroll and letting children manage it
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const user = getStoredUser()

  const currentPath = location.pathname

  // User initials for avatar fallback
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* 1. Sidebar - Left Panel */}
      <aside className="w-[280px] bg-[#111111] border-r border-[#222]/60 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-20">
        <div className="flex flex-col">
          {/* Logo / Brand */}
          <div className="px-6 py-6 border-b border-[#222]/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Expense <span className="text-[#f97316]">Tracker</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1">
            <Link to="/dashboard">
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-md transition-all cursor-pointer ${
                  currentPath === '/dashboard'
                    ? 'bg-[#1a1a1a] border-l-2 border-[#f97316] text-white font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard
                    className={`w-4 h-4 ${
                      currentPath === '/dashboard'
                        ? 'text-[#f97316]'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-medium">Track</span>
                </div>
                {currentPath === '/dashboard' && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                )}
              </div>
            </Link>

            <Link to="/about">
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-md transition-all cursor-pointer ${
                  currentPath === '/about'
                    ? 'bg-[#1a1a1a] border-l-2 border-[#f97316] text-white font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    className={`w-4 h-4 ${
                      currentPath === '/about'
                        ? 'text-[#f97316]'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-medium">About</span>
                </div>
                {currentPath === '/about' && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                )}
              </div>
            </Link>
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-t border-[#222]/40 bg-[#0d0d0d]">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="w-10 h-10 border border-[#222]">
              <AvatarImage src={user?.pictureUrl ?? undefined} />
              <AvatarFallback className="bg-[#f97316]/10 text-[#f97316] font-semibold text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate text-white">
                {user?.name ?? 'User'}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.email ?? ''}
              </span>
            </div>
          </div>
          <div className="mt-3 px-2 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-gray-600">Online</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors h-7 px-2 text-xs gap-1"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <main className="flex-1 flex flex-col pt-6 px-6 pb-6 md:pt-8 md:px-8 md:pb-8 max-w-7xl mx-auto overflow-hidden min-h-0 z-10 relative w-full">
        {/* Decorative Ambient Radial */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_70%)] blur-[60px] pointer-events-none z-0" />
        {children}
      </main>
    </div>
  )
}
