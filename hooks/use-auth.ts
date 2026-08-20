'use client'

import { useSyncExternalStore, useCallback, useMemo } from 'react'
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  setSession,
  clearSession,
  refreshFromStorage,
} from '@/lib/auth-store'
import type { AuthUser } from '@/lib/api/types'
import { isAdmin as isAdminRole, isUser as isUserRole, hasRole as hasRoleFn, hasAnyRole as hasAnyRoleFn } from '@/lib/rbac'

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

  const role = state.user?.role

  const roleUtils = useMemo(() => ({
    isAdmin: isAdminRole(role),
    isUser: isUserRole(role),
    hasRole: (requiredRole: string) => hasRoleFn(role, requiredRole),
    hasAnyRole: (requiredRoles: readonly string[]) => hasAnyRoleFn(role, requiredRoles),
  }), [role])

  return {
    token: state.token,
    user: state.user,
    role: role ?? null,
    isAuthenticated: !!state.token,
    isLoading: !state.hydrated,
    logout,
    ...roleUtils,
  }
}
