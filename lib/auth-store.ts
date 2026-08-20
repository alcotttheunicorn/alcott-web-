import type { AuthUser } from './api/types'

// Single source of truth for auth state. Two things read from this:
//  1. The axios interceptor in api-client.ts (plain JS, can't use React hooks)
//  2. hooks/use-auth.ts, via useSyncExternalStore, for components
//
// Previously every page called useAuth() independently, each with its own
// useState+useEffect reading localStorage directly, and 25+ API call sites
// each manually built an Authorization header. This collapses all of that
// into one place: read/write happens here, the interceptor attaches the
// header automatically, and cross-tab logout is handled by the storage
// listener at the bottom instead of not existing at all.

interface AuthState {
  token: string
  user: AuthUser | null
  hydrated: boolean
}

let state: AuthState = { token: '', user: null, hydrated: false }
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot() {
  return state
}

export function getServerSnapshot(): AuthState {
  return { token: '', user: null, hydrated: false }
}

// Plain function, no React needed — this is what the axios interceptor calls.
export function getToken() {
  return state.token
}

function readStorage(): AuthState {
  if (typeof window === 'undefined') return { token: '', user: null, hydrated: true }

  const token = window.localStorage.getItem('authToken')
    ?? window.sessionStorage.getItem('authToken')
    ?? ''

  const rawUser = window.localStorage.getItem('authUser')
    ?? window.sessionStorage.getItem('authUser')

  let user: AuthUser | null = null
  if (rawUser) {
    try {
      user = JSON.parse(rawUser)
    } catch {
      user = null
    }
  }

  return { token, user, hydrated: true }
}

export function refreshFromStorage() {
  state = readStorage()
  emit()
}

export function setSession(user: AuthUser, token: string, rememberMe = false) {
  if (typeof window !== 'undefined') {
    const storage = rememberMe ? window.localStorage : window.sessionStorage
    storage.setItem('authToken', token)
    storage.setItem('authUser', JSON.stringify(user))
    window.localStorage.removeItem('pendingSignupEmail')
    window.localStorage.removeItem('pendingResetEmail')
  }
  state = { token, user, hydrated: true }
  emit()
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('authUser')
    window.localStorage.removeItem('pendingSignupEmail')
    window.sessionStorage.removeItem('authToken')
    window.sessionStorage.removeItem('authUser')
  }
  state = { token: '', user: null, hydrated: true }
  emit()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'authToken' || e.key === 'authUser' || e.key === null) {
      refreshFromStorage()
    }
  })
}