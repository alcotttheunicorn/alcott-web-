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

function authHeader(token: string) {
  const t = token.trim()
  return t.startsWith('Bearer ') ? t : `Bearer ${t}`
}

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
  token: string,
  sender_address: string,
  receiver_address: string,
  weight: number,
): Promise<ApiResponse<PricingResult>> {
  const { data } = await apiClient.post('/pricing/check/authenticated', {
    sender_address,
    receiver_address,
    weight,
  }, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

// --- Admin pricing config ---

export async function getPricingOverview(token: string): Promise<ApiResponse<PricingOverview>> {
  const { data } = await apiClient.get('/pricing/admin/overview', {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function getZonePricing(token: string): Promise<ApiResponse<ZonePricing[]>> {
  const { data } = await apiClient.get('/pricing/admin/zones', {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function upsertZonePricing(
  token: string,
  zone: ZonePricing,
): Promise<ApiResponse<ZonePricing>> {
  const { data } = await apiClient.put('/pricing/admin/zones', zone, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function getRegionPricing(token: string): Promise<ApiResponse<RegionPricing[]>> {
  const { data } = await apiClient.get('/pricing/admin/regions', {
    headers: { Authorization: authHeader(token) },
  })
  return data
}


export async function upsertPremisePricing(
  token: string,
  premise: PremisePricing,
): Promise<ApiResponse<PremisePricing>> {
  const { data } = await apiClient.put('/pricing/admin/premise', premise, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function importPricingConfig(token: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/pricing/admin/import', null, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}