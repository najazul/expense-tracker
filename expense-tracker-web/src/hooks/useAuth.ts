import { setToken, setStoredUser, clearAuth, type AuthUser } from '../lib/auth'
import { API_BASE } from '../lib/api-client'
import { useNavigate } from '@tanstack/react-router'

export function useAuth() {
  const navigate = useNavigate()

  const googleLogin = async (idToken: string) => {
    const response = await fetch(`${API_BASE}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })

    if (!response.ok) {
      throw new Error('Authentication failed')
    }

    const data = await response.json() as {
      accessToken: string
      user: AuthUser
    }

    setToken(data.accessToken)
    setStoredUser(data.user)
    navigate({ to: '/dashboard' })
    return data
  }

  const logout = () => {
    clearAuth()
    navigate({ to: '/' })
  }

  return { googleLogin, logout }
}
