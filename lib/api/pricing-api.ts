import apiClient from '@/lib/api-client'
import type { ApiResponse, PricingResult } from './types'

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
