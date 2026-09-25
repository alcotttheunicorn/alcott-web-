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
  updateAdminShipment,
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
import type { ShipmentData, PaginatedResponse } from '@/lib/api/types'
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
  status?: string | string[]
  user_id?: string
  page?: number
  limit?: number
}) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  const statuses: string[] | undefined = Array.isArray(params?.status) && params.status.length > 0
    ? params.status
    : typeof params?.status === 'string'
      ? [params.status]
      : undefined

  return useQuery({
    queryKey: [...queryKeys.admin.shipments, JSON.stringify(statuses), params?.user_id, params?.page, params?.limit],
    queryFn: async () => {
      if (!statuses) {
        const res = await getAdminShipments({ user_id: params?.user_id, page: params?.page, limit: params?.limit })
        return extractShipments(res)
      }
      const results = await Promise.all(
        statuses.map((s) => getAdminShipments({
          user_id: params?.user_id,
          page: params?.page,
          limit: params?.limit,
          status: s,
        })),
      )
      const seen = new Set<string>()
      const merged: ShipmentData[] = []
      for (const res of results) {
        for (const shipment of extractShipments(res)) {
          if (shipment.id && !seen.has(shipment.id)) {
            seen.add(shipment.id)
            merged.push(shipment)
          }
        }
      }
      return merged
    },
    enabled: isAuthenticated && hasAdminAccess,
  })
}

function extractShipments(res: PaginatedResponse<{ shipments: ShipmentData[] }>): ShipmentData[] {
  const body = res?.data as unknown
  if (Array.isArray(body)) return body as ShipmentData[]
  return Array.isArray((body as { shipments?: ShipmentData[] } | null)?.shipments)
    ? (body as { shipments: ShipmentData[] }).shipments
    : []
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

export function useUpdateAdminShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string
      min_delivery_days?: number
      max_delivery_days?: number
      payment_method?: string
      payment_status?: string
      price?: number
    }) => updateAdminShipment(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipments })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentDetail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.shipmentEvents(variables.id) })
    },
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