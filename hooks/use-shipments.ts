'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import {
  createShipment,
  getShipments,
  getShipmentById,
  getShipmentByTrackingId,
  getCategories,
  verifyPayment,
  payShipment,
  updateShipment,
  type PayShipmentRequest,
  type UpdateShipmentRequest,
  type CreateShipmentRequest,
} from '@/lib/api/shipment-api'
import { queryKeys } from '@/components/providers/query-provider'

export function useShipments(params?: { status?: string; page?: number; limit?: number }) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: [...queryKeys.shipments.all, params?.status, params?.page, params?.limit],
    queryFn: () =>
      getShipments(params).then((res) => (Array.isArray(res.data) ? res.data : [])),
    enabled: isAuthenticated,
  })
}

export function useShipmentById(id: string) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.shipments.detail(id),
    queryFn: () => getShipmentById(id).then((res) => res.data),
    enabled: isAuthenticated && !!id,
    retry: false,
  })
}

export function useShipmentByTrackingId(trackingId: string) {
  return useQuery({
    queryKey: queryKeys.shipments.tracking(trackingId),
    queryFn: () => getShipmentByTrackingId(trackingId).then((res) => res.data),
    enabled: !!trackingId,
    retry: false,
  })
}

export function useShipmentCategories() {
  return useQuery({
    queryKey: queryKeys.shipments.categories,
    queryFn: () => getCategories().then((res) => res.data),
  })
}

export function useCreateShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateShipmentRequest) => createShipment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance })
    },
  })
}

export function useVerifyShipmentPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reference: string) => verifyPayment(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions })
    },
  })
}

export function usePayShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayShipmentRequest }) => payShipment(id, payload),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions })
    },
  })
}

export function useUpdateShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShipmentRequest }) => updateShipment(id, payload),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.detail(variables.id) })
    },
  })
}
