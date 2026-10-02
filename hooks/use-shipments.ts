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
  type ShipmentCategoryOption,
} from '@/lib/api/shipment-api'
import { queryKeys } from '@/components/providers/query-provider'

export function useShipments(params?: { status?: string; page?: number; limit?: number }) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: [...queryKeys.shipments.all, params?.status, params?.page, params?.limit],
    queryFn: async () => {
      const response = await getShipments(params)
      const payload = response.data as unknown
      if (Array.isArray(payload)) return payload
      if (!payload || typeof payload !== 'object') return []

      const data = payload as { shipments?: unknown; data?: { shipments?: unknown } }
      if (Array.isArray(data.shipments)) return data.shipments
      if (Array.isArray(data.data?.shipments)) return data.data.shipments
      return []
    },
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
    queryFn: async () => {
      const response = await getCategories()
      const payload = response?.data
      const fallbackCategories: ShipmentCategoryOption[] = [
        { value: 'DOCUMENTS', label: 'Documents' },
        { value: 'PERSONAL_EFFECTS', label: 'Personal Effects' },
        { value: 'ELECTRONICS_AND_GADGETS', label: 'Electronics & Gadgets' },
        { value: 'FASHION_AND_APPAREL', label: 'Fashion & Apparel' },
        { value: 'BEAUTY_AND_COSMETICS', label: 'Beauty & Cosmetics' },
        { value: 'FOOD_AND_CONSUMABLES', label: 'Food & Consumables' },
        { value: 'MEDICAL_AND_HEALTHCARE', label: 'Medical & Healthcare' },
        { value: 'INDUSTRIAL_AND_ENGINEERING', label: 'Industrial & Engineering' },
        { value: 'AUTOMOTIVE', label: 'Automotive' },
        { value: 'OIL_AND_GAS', label: 'Oil & Gas' },
        { value: 'COMMERCIAL_GOODS', label: 'Commercial Goods' },
        { value: 'SAMPLES', label: 'Samples' },
        { value: 'MACHINERY_OVERSIZED_CARGO', label: 'Machinery / Oversized Cargo' },
        { value: 'DANGEROUS_GOODS', label: 'Dangerous Goods' },
        { value: 'OTHER', label: 'Other' },
      ]

      const rawList = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { categories?: unknown })?.categories)
          ? ((payload as { categories: unknown[] }).categories)
          : Array.isArray((payload as { data?: unknown })?.data)
            ? ((payload as { data: unknown[] }).data)
            : []

      const normalized = rawList.filter((item): item is ShipmentCategoryOption => {
        if (!item || typeof item !== 'object') return false
        const candidate = item as Partial<ShipmentCategoryOption> & { name?: string; value?: string; label?: string }
        const value = candidate.value ?? candidate.name
        const label = candidate.label ?? candidate.value ?? candidate.name
        return typeof value === 'string' && typeof label === 'string'
      }).map((item) => ({
        value: String(item.value ?? item.label ?? '').trim(),
        label: String(item.label ?? item.value ?? '').trim(),
      })).filter((item) => item.value && item.label)

      return normalized.length > 0 ? normalized : fallbackCategories
    },
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
