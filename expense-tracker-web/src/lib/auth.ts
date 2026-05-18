// Auth utility for managing JWT tokens in localStorage

const TOKEN_KEY = 'expense_tracker_token'
const USER_KEY = 'expense_tracker_user'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  pictureUrl: string | null
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!getToken()
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = getToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}
