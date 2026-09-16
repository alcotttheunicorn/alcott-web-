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
  sender_email?: string,
  sender_phone_number?: string,
): Promise<ApiResponse<PricingResult>> {
  const { data } = await apiClient.post('/pricing/check', {
    sender_address,
    receiver_address,
    weight,
    ...(sender_email ? { sender_email } : {}),
    ...(sender_phone_number ? { sender_phone_number } : {}),
  })
  return data
}

export async function checkPricingAuth(
  sender_address: string,
  receiver_address: string,
  weight: number,
  sender_email?: string,
  sender_phone_number?: string,
): Promise<ApiResponse<PricingResult>> {
  const { data } = await apiClient.post('/pricing/check/authenticated', {
    sender_address,
    receiver_address,
    weight,
    ...(sender_email ? { sender_email } : {}),
    ...(sender_phone_number ? { sender_phone_number } : {}),
  })
  return data
}

export async function getExchangeRate(): Promise<ApiResponse<{ id: string; ngn_per_usd: number }>> {
  const { data } = await apiClient.get('/pricing/exchange-rate')
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

export async function createZonePricing(zone: ZonePricing): Promise<ApiResponse<ZonePricing>> {
  const { data } = await apiClient.post('/pricing/admin/zones', zone)
  return data
}

export async function replaceZonePricing(zone: ZonePricing): Promise<ApiResponse<ZonePricing>> {
  const { data } = await apiClient.put('/pricing/admin/zones', zone)
  return data
}

export async function updateZonePricing(
  code: number,
  zone: Omit<ZonePricing, 'zone_code'>,
): Promise<ApiResponse<ZonePricing>> {
  const { data } = await apiClient.patch(`/pricing/admin/zones/${code}`, zone)
  return data
}

export async function getRegionPricing(): Promise<ApiResponse<RegionPricing[]>> {
  const { data } = await apiClient.get('/pricing/admin/regions')
  return data
}

export async function createRegionPricing(
  region: { name: string; states?: string[] },
): Promise<ApiResponse<RegionPricing>> {
  const { data } = await apiClient.post('/pricing/admin/regions', region)
  return data
}

export async function updateRegionPricing(
  id: string,
  region: { name: string; states: string[] },
): Promise<ApiResponse<RegionPricing>> {
  const { data } = await apiClient.patch(`/pricing/admin/regions/${id}`, region)
  return data
}

export async function getPremisePricing(): Promise<ApiResponse<PremisePricing>> {
  const { data } = await apiClient.get('/pricing/admin/premise')
  return data
}

export async function upsertPremisePricing(premise: PremisePricing): Promise<ApiResponse<PremisePricing>> {
  const { data } = await apiClient.put('/pricing/admin/premise', premise)
  return data
}

export async function updateExchangeRate(ngn_per_usd: number): Promise<ApiResponse<{ id: string; ngn_per_usd: number }>> {
  const { data } = await apiClient.put('/pricing/admin/exchange-rate', { ngn_per_usd })
  return data
}

export async function importPricingConfig(): Promise<MessageResponse> {
  const { data } = await apiClient.post('/pricing/admin/import')
  return data
}