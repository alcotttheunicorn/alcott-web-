'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { isAdmin } from '@/lib/rbac'
import {
  checkPricing,
  checkPricingAuth,
  getExchangeRate,
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
import type { ZonePricing, PremisePricing, RegionPricing, RegionZoneRateCard } from '@/lib/api/types'
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

export function useExchangeRate() {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.pricing.exchangeRate,
    queryFn: () => getExchangeRate().then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
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

    queryFn: async () => {
      const response = await getZonePricing()
      const data = response.data as any

      const zones = Array.isArray(data)
        ? data
        : Array.isArray(data?.zones)
          ? data.zones
          : []

      return zones.map((zone: any): ZonePricing => {
        const importRateCard = (zone.rate_cards ?? []).find(
          (card: any) => card.mode === 'IMPORT'
        )

        const exportRateCard = (zone.rate_cards ?? []).find(
          (card: any) => card.mode === 'EXPORT'
        )

        return {
          zone_code: zone.code,
          base_country_code: zone.base_country?.code,
          destination_country_codes: (zone.destinations ?? [])
            .map((destination: any) => destination.country?.code)
            .filter(Boolean),
          import_slabs: importRateCard?.slabs ?? [],
          export_slabs: exportRateCard?.slabs ?? [],
        }
      })
    },

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
    queryFn: async () => {
      const response = await getRegionPricing()
      const payload = response.data as unknown

      if (Array.isArray(payload)) {
        return { regions: payload as RegionPricing[], zoneRateCards: [] as RegionZoneRateCard[] }
      }
      if (!payload || typeof payload !== 'object') {
        return { regions: [] as RegionPricing[], zoneRateCards: [] as RegionZoneRateCard[] }
      }

      const wrapped = payload as {
        regions?: unknown
        data?: unknown
        items?: unknown
        zone_rate_cards?: unknown
      }

      const regions = Array.isArray(wrapped.regions)
        ? wrapped.regions
        : Array.isArray(wrapped.data)
          ? wrapped.data
          : Array.isArray(wrapped.items)
            ? wrapped.items
            : []

      const zoneRateCards = Array.isArray(wrapped.zone_rate_cards) ? wrapped.zone_rate_cards : []

      return {
        regions: regions as RegionPricing[],
        zoneRateCards: zoneRateCards as RegionZoneRateCard[],
      }
    },
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