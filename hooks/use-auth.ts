'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AuthUser } from '@/lib/api/types'

export function useAuth() {
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('authUser')
    window.sessionStorage.removeItem('authToken')
    window.sessionStorage.removeItem('authUser')
    setToken('')
    setUser(null)
    window.location.href = '/auth/lets-get-you-in'
  }, [])

  return {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    logout,
  }
}
