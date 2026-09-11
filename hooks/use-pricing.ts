'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { isAdmin } from '@/lib/rbac'
import {
  checkPricing,
  checkPricingAuth,
  getPricingOverview,
  getZonePricing,
  createZonePricing,
  replaceZonePricing,
  updateZonePricing,
  getRegionPricing,
  createRegionPricing,
  updateRegionPricing,
  getPremisePricing,
  upsertPremisePricing,
  updateExchangeRate,
  importPricingConfig,
} from '@/lib/api/pricing-api'
import type { ZonePricing, PremisePricing } from '@/lib/api/types'
import { queryKeys } from '@/components/providers/query-provider'

export function useCheckPricing() {
  return useMutation({
    mutationFn: ({
      sender_address,
      receiver_address,
      weight,
      sender_email,
      sender_phone_number,
    }: {
      sender_address: string
      receiver_address: string
      weight: number
      sender_email?: string
      sender_phone_number?: string
    }) => checkPricing(sender_address, receiver_address, weight, sender_email, sender_phone_number),
  })
}

export function useCheckPricingAuth() {
  const { isAuthenticated } = useAuth()

  return useMutation({
    mutationFn: ({
      sender_address,
      receiver_address,
      weight,
      sender_email,
      sender_phone_number,
    }: {
      sender_address: string
      receiver_address: string
      weight: number
      sender_email?: string
      sender_phone_number?: string
    }) => checkPricingAuth(sender_address, receiver_address, weight, sender_email, sender_phone_number),
    retry: false,
  })
}

export function usePricingOverview() {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.pricing.overview,
    queryFn: () => getPricingOverview().then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useZonePricing() {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.pricing.zones,
    queryFn: () => getZonePricing().then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useCreateZonePricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (zone: ZonePricing) => createZonePricing(zone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.zones })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
    },
  })
}

export function useReplaceZonePricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (zone: ZonePricing) => replaceZonePricing(zone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.zones })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
    },
  })
}

export function useUpdateZonePricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ code, zone }: { code: number; zone: Omit<ZonePricing, 'zone_code'> }) =>
      updateZonePricing(code, zone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.zones })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
    },
  })
}

export function useRegionPricing() {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.pricing.regions,
    queryFn: () => getRegionPricing().then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function usePremisePricing() {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.pricing.premise,
    queryFn: () => getPremisePricing().then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useCreateRegionPricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, states }: { name: string; states?: string[] }) =>
      createRegionPricing({ name, states }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.regions })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
    },
  })
}

export function useUpdateExchangeRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ngn_per_usd: number) => updateExchangeRate(ngn_per_usd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.exchangeRate })
    },
  })
}

export function useUpsertPremisePricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (premise: PremisePricing) => upsertPremisePricing(premise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.premise })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
    },
  })
}

export function useImportPricingConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => importPricingConfig(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.zones })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.regions })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.premise })
    },
  })
}

export function useUpdateRegionPricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name, states }: { id: string; name: string; states: string[] }) =>
      updateRegionPricing(id, { name, states }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.regions })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
    },
  })
}