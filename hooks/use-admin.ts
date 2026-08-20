'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import {
  getAdminUsers,
  getAdminShipments,
  getAdminActivityLogs,
  type AdminUser,
} from '@/lib/api/admin-api'
import { queryKeys } from '@/components/providers/query-provider'

export function useAdminUsers(params?: { page?: number; limit?: number }) {
  const { isAuthenticated, isAdmin } = useAuth()

  return useQuery({
    queryKey: [...queryKeys.admin.users, params?.page, params?.limit],
    queryFn: () => getAdminUsers(params),
    enabled: isAuthenticated && isAdmin,
  })
}

export function useAdminShipments(params?: {
  status?: string
  user_id?: string
  page?: number
  limit?: number
}) {
  const { isAuthenticated, isAdmin } = useAuth()

  return useQuery({
    queryKey: [...queryKeys.admin.shipments, params?.status, params?.user_id, params?.page, params?.limit],
    queryFn: () =>
      getAdminShipments(params).then((res) => (Array.isArray(res.data) ? res.data : [])),
    enabled: isAuthenticated && isAdmin,
  })
}

export function useAdminActivityLogs(params?: {
  user_id?: string
  action?: string
  page?: number
  limit?: number
}) {
  const { isAuthenticated, isAdmin } = useAuth()

  return useQuery({
    queryKey: [...queryKeys.admin.activityLogs, params?.user_id, params?.action, params?.page, params?.limit],
    queryFn: () => getAdminActivityLogs(params),
    enabled: isAuthenticated && isAdmin,
  })
}

export function displayAdminName(user: AdminUser) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
  return name || user.email
}
