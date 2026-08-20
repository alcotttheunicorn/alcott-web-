import apiClient from '@/lib/api-client'
import type {
  ApiResponse,
  MessageResponse,
  PricingResult,
  PricingOverview,
  ZonePricing,
  RegionPricing,
  PremisePricing,
} from './types'

export async function checkPricing(
  sender_address: string,
  receiver_address: string,
  weight: number,
): Promise<ApiResponse<PricingResult>> {
  const { data } = await apiClient.post('/pricing/check', {
    sender_address,
    receiver_address,
    weight,
  })
  return data
}

export async function checkPricingAuth(
  sender_address: string,
  receiver_address: string,
  weight: number,
): Promise<ApiResponse<PricingResult>> {
  const { data } = await apiClient.post('/pricing/check/authenticated', {
    sender_address,
    receiver_address,
    weight,
  })
  return data
}

// --- Admin pricing config ---

export async function getPricingOverview(): Promise<ApiResponse<PricingOverview>> {
  const { data } = await apiClient.get('/pricing/admin/overview')
  return data
}

export async function getZonePricing(): Promise<ApiResponse<ZonePricing[]>> {
  const { data } = await apiClient.get('/pricing/admin/zones')
  return data
}

export async function upsertZonePricing(zone: ZonePricing): Promise<ApiResponse<ZonePricing>> {
  const { data } = await apiClient.put('/pricing/admin/zones', zone)
  return data
}

export async function getRegionPricing(): Promise<ApiResponse<RegionPricing[]>> {
  const { data } = await apiClient.get('/pricing/admin/regions')
  return data
}


export async function upsertPremisePricing(premise: PremisePricing): Promise<ApiResponse<PremisePricing>> {
  const { data } = await apiClient.put('/pricing/admin/premise', premise)
  return data
}

export async function importPricingConfig(): Promise<MessageResponse> {
  const { data } = await apiClient.post('/pricing/admin/import')
  return data
}