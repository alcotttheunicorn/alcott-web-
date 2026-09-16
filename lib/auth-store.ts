import type { AuthUser } from './api/types'


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

  if (
    typeof window !== 'undefined' &&
    state.token &&
    state.user &&
    !document.cookie.includes('authToken=')
  ) {
    const persistent = Boolean(window.localStorage.getItem('authToken'))
    writeSessionCookies(state.user, state.token, persistent)
  }

  emit()
}

function writeSessionCookies(user: AuthUser, token: string, persistent: boolean) {
  const maxAge = persistent ? `; max-age=${30 * 24 * 60 * 60}` : ''
  document.cookie = `authToken=${token}; path=/${maxAge}; SameSite=Lax`
  document.cookie = `authUser=${encodeURIComponent(JSON.stringify(user))}; path=/${maxAge}; SameSite=Lax`
}

export function setSession(user: AuthUser, token: string, rememberMe = false) {
  if (typeof window !== 'undefined') {
    const storage = rememberMe ? window.localStorage : window.sessionStorage
    storage.setItem('authToken', token)
    storage.setItem('authUser', JSON.stringify(user))
    window.localStorage.removeItem('pendingSignupEmail')
    window.localStorage.removeItem('pendingResetEmail')

    writeSessionCookies(user, token, rememberMe)
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

    // Clear cookies for middleware by setting max-age to 0
    document.cookie = 'authToken=; path=/; max-age=0; SameSite=Lax'
    document.cookie = 'authUser=; path=/; max-age=0; SameSite=Lax'
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