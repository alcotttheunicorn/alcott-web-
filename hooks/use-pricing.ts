'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import {
  checkPricing,
  checkPricingAuth,
  getPricingOverview,
  getZonePricing,
  upsertZonePricing,
  getRegionPricing,
  upsertPremisePricing,
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
    }: {
      sender_address: string
      receiver_address: string
      weight: number
    }) => checkPricing(sender_address, receiver_address, weight),
  })
}

export function useCheckPricingAuth() {
  const { isAuthenticated } = useAuth()

  return useMutation({
    mutationFn: ({
      sender_address,
      receiver_address,
      weight,
    }: {
      sender_address: string
      receiver_address: string
      weight: number
    }) => checkPricingAuth(sender_address, receiver_address, weight),
    retry: false,
  })
}

export function usePricingOverview() {
  const { isAuthenticated, isAdmin } = useAuth()

  return useQuery({
    queryKey: queryKeys.pricing.overview,
    queryFn: () => getPricingOverview().then((res) => res.data),
    enabled: isAuthenticated && isAdmin,
  })
}

export function useZonePricing() {
  const { isAuthenticated, isAdmin } = useAuth()

  return useQuery({
    queryKey: queryKeys.pricing.zones,
    queryFn: () => getZonePricing().then((res) => res.data),
    enabled: isAuthenticated && isAdmin,
  })
}

export function useUpsertZonePricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (zone: ZonePricing) => upsertZonePricing(zone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.zones })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.overview })
    },
  })
}

export function useRegionPricing() {
  const { isAuthenticated, isAdmin } = useAuth()

  return useQuery({
    queryKey: queryKeys.pricing.regions,
    queryFn: () => getRegionPricing().then((res) => res.data),
    enabled: isAuthenticated && isAdmin,
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