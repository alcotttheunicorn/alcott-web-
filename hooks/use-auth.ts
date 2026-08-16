'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AuthUser } from '@/lib/api/types'

export function clearAuthSession() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem('authToken')
  window.localStorage.removeItem('authUser')
  window.localStorage.removeItem('pendingSignupEmail')
  window.sessionStorage.removeItem('authToken')
  window.sessionStorage.removeItem('authUser')
}

export function saveAuthSession(user: AuthUser, token: string, rememberMe = false) {
  if (typeof window === 'undefined') return

  const storage = rememberMe ? window.localStorage : window.sessionStorage
  storage.setItem('authToken', token)
  storage.setItem('authUser', JSON.stringify(user))

  window.localStorage.removeItem('pendingSignupEmail')
  window.localStorage.removeItem('pendingResetEmail')
}

export function useAuth() {
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    const storedToken = window.localStorage.getItem('authToken')
      ?? window.sessionStorage.getItem('authToken')
      ?? ''

    const storedUser = window.localStorage.getItem('authUser')
      ?? window.sessionStorage.getItem('authUser')

    setToken(storedToken)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    setToken('')
    setUser(null)
    window.location.href = '/lets-get-you-in'
  }, [])

  return {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    logout,
  }
}
