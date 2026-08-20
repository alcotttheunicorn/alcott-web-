'use client'

import { useSyncExternalStore, useCallback } from 'react'
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  setSession,
  clearSession,
  refreshFromStorage,
} from '@/lib/auth-store'
import type { AuthUser } from '@/lib/api/types'

export function saveAuthSession(user: AuthUser, token: string, rememberMe = false) {
  setSession(user, token, rememberMe)
}

export function clearAuthSession() {
  clearSession()
}

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (typeof window !== 'undefined' && !state.hydrated) {
    refreshFromStorage()
  }

  const logout = useCallback(() => {
    clearSession()
    window.location.href = '/lets-get-you-in'
  }, [])

  return {
    token: state.token,
    user: state.user,
    isAuthenticated: !!state.token,
    isLoading: !state.hydrated,
    logout,
  }
}