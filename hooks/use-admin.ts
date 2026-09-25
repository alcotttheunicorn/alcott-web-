'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { isAdmin } from '@/lib/rbac'
import {
  getAdminUsers,
  getAdminShipments,
  getAdminActivityLogs,
  getAdminShipment,
  getShipmentEvents,
  getAdminEvents,
  getAdminRateChecks,
  completeAdminShipment,
  cancelAdminShipment,
  startProcessingShipment,
  deliverShipment,
  appendShipmentEvent,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
  type AdminUser,
  type AdminShipmentEvent,
  type AdminEvent,
  type RateCheck,
} from '@/lib/api/admin-api'
import { queryKeys } from '@/components/providers/query-provider'

export function useAdminUsers(params?: { page?: number; limit?: number }) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: [...queryKeys.admin.users, params?.page, params?.limit],
    queryFn: () => getAdminUsers(params),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

// Fetches every user by walking all pages of /admin/users so the dashboard
// stats (total, per-month, new-this-month, active, CSV) can be computed from
// the same source of truth instead of the hardcoded mock numbers.
export function useAdminAllUsers() {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: [...queryKeys.admin.users, 'all'],
    queryFn: async () => {
      const pageSize = 50
      const first = await getAdminUsers({ page: 1, limit: pageSize })
      const all = [...(first.data?.users ?? [])]
      const totalPages = first.totalPages ?? 1
      for (let page = 2; page <= totalPages; page += 1) {
        const res = await getAdminUsers({ page, limit: pageSize })
        all.push(...(res.data?.users ?? []))
      }
      return { users: all, totalItems: first.totalItems ?? all.length }
    },
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useAdminShipments(params?: {
  status?: string
  user_id?: string
  page?: number
  limit?: number
}) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: [...queryKeys.admin.shipments, params?.status, params?.user_id, params?.page, params?.limit],
    queryFn: () =>
      getAdminShipments(params).then((res) => res.data?.shipments ?? []),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useAdminShipment(id: string) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.admin.shipmentDetail(id),
    queryFn: () => getAdminShipment(id).then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess && !!id,
    retry: false,
  })
}

export function useAdminShipmentEvents(id: string) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.admin.shipmentEvents(id),
    queryFn: () =>
      getShipmentEvents(id).then((res) => (Array.isArray(res.data) ? res.data : [])),
    enabled: isAuthenticated && hasAdminAccess && !!id,
    retry: false,
  })
}

export function useAdminEvents(params?: { search?: string; page?: number; limit?: number }) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: [...queryKeys.admin.events, params?.search, params?.page, params?.limit],
    queryFn: () => getAdminEvents(params),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useAdminRateChecks(params?: { page?: number; limit?: number }) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: [...queryKeys.admin.rateChecks, params?.page, params?.limit],
    queryFn: () =>
      getAdminRateChecks(params).then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useAdminActivityLogs(params?: {
  user_id?: string
  action?: string
  page?: number
  limit?: number
}) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: [...queryKeys.admin.activityLogs, params?.user_id, params?.action, params?.page, params?.limit],
    queryFn: () => getAdminActivityLogs(params),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useCompleteAdminShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payment_method,
      currency,
    }: {
      id: string
      payment_method: 'USER_WALLET' | 'CARD' | 'ADMIN_WALLET'
      currency?: 'NGN' | 'USD'
    }) => completeAdminShipment(id, { payment_method, currency }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipments })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentDetail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentEvents(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance })
    },
  })
}

export function useCancelAdminShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cancelAdminShipment(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipments })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentDetail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentEvents(id) })
    },
  })
}

export function useStartProcessingShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => startProcessingShipment(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipments })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentDetail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentEvents(id) })
    },
  })
}

export function useDeliverShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deliverShipment(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipments })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentDetail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentEvents(id) })
    },
  })
}

export function useAppendShipmentEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, event_id, location }: { id: string; event_id: string; location: string }) =>
      appendShipmentEvent(id, { event_id, location }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentEvents(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentDetail(variables.id) })
    },
  })
}


export function useCreateAdminEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name: string; description?: string }) => createAdminEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.events })
    },
  })
}

export function useUpdateAdminEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name, description }: { id: string; name: string; description?: string }) =>
      updateAdminEvent(id, { name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.events })
    },
  })
}

export function useDeleteAdminEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAdminEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.events })
    },
  })
}

export function displayAdminName(user: AdminUser) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
  return name || user.email
}

export type { AdminShipmentEvent, AdminEvent, RateCheck }