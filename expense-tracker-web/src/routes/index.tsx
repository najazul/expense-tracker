import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Receipt, Activity } from 'lucide-react'
import { useAuth } from '#/hooks/useAuth'

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
          }) => void
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string
              size?: string
              width?: number
              shape?: string
              text?: string
            },
          ) => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { googleLogin } = useAuth()
  const googleBtnRef = useRef<HTMLDivElement>(null)

  // Initialize Google Sign-In
  useEffect(() => {

    const initGoogleSignIn = () => {
      if (!window.google || !googleBtnRef.current) return

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      })

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 300,
        shape: 'rectangular',
        text: 'signin_with',
      })
    }

    // GSI script might load after our component mounts
    if (window.google) {
      initGoogleSignIn()
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initGoogleSignIn()
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [])

  const handleGoogleResponse = async (response: { credential: string }) => {
    try {
      await googleLogin(response.credential)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)] blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)] blur-[80px]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[length:32px_32px] bg-[image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#222]/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#f97316] flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <Receipt className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight font-sans">
            Expense<span className="text-[#f97316]">Flow</span>
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto py-12">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-semibold tracking-wider uppercase mb-8 animate-pulse">
          <Activity className="w-3.5 h-3.5" />
          Seamless Financial Control
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-6 select-none max-w-3xl">
          <span className="font-serif block text-white font-normal">THE WAY WE</span>
          <span className="font-serif block italic font-light text-[#f97316]">track expenses.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
          Track, categorize, and visualize your personal or team spending. 
          The ultimate minimal command dashboard for any modern workflow.
        </p>

        {/* Google Sign-In Button */}
        <div className="flex flex-col items-center gap-4">
          <div 
            ref={googleBtnRef} 
            id="google-signin-btn"
            className="min-h-[44px]"
          />
          <p className="text-xs text-gray-600">
            Sign in with your Google account to get started
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#222]/40 text-center text-xs text-gray-500">
        <p>&copy; 2026 Norman Jazul. A personal Project</p>
      </footer>
    </div>
  )
}
