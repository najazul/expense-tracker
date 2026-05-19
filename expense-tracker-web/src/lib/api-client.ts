import { getAuthHeaders, clearAuth } from './auth'

export const API_BASE = import.meta.env.VITE_API_BASE

export interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const isFormData = body instanceof FormData

  const finalHeaders: Record<string, string> = {
    ...getAuthHeaders(),
    ...headers,
  }

  // Browser automatically sets Content-Type with boundary for FormData
  if (!isFormData && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  })

  // If unauthorized, clear auth and redirect to login
  if (response.status === 401) {
    clearAuth()
    window.location.href = '/'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `Request failed with status ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
