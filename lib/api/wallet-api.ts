import apiClient from '@/lib/api-client'
import type { ApiResponse, MessageResponse, PaginatedResponse, WalletBalance, WalletFundInit, Transaction } from './types'

function authHeader(token: string) {
  const t = token.trim()
  return t.startsWith('Bearer ') ? t : `Bearer ${t}`
}

export async function getBalance(token: string): Promise<ApiResponse<WalletBalance>> {
  const { data } = await apiClient.get('/wallet/balance', {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function initializeFund(token: string, amount: number): Promise<ApiResponse<WalletFundInit>> {
  const { data } = await apiClient.post('/wallet/fund/initialize', { amount }, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function verifyFund(token: string, reference: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/wallet/fund/verify', { reference }, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function getTransactions(
  token: string,
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<{ transactions: Transaction[] }>> {
  const params: Record<string, number> = {}
  if (page) params.page = page
  if (limit) params.limit = limit

  const { data } = await apiClient.get('/wallet/transactions', {
    headers: { Authorization: authHeader(token) },
    params,
  })
  return data
}
