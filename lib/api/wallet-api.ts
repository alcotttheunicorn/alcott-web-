import apiClient from '@/lib/api-client'
import type { ApiResponse, MessageResponse, PaginatedResponse, WalletBalance, WalletFundInit, Transaction } from './types'

export async function getBalance(): Promise<ApiResponse<WalletBalance>> {
  const { data } = await apiClient.get('/wallet/balance')
  return data
}

export async function initializeFund(amount: number): Promise<ApiResponse<WalletFundInit>> {
  const { data } = await apiClient.post('/wallet/fund/initialize', { amount })
  return data
}

export async function verifyFund(reference: string): Promise<MessageResponse> {
  const { data } = await apiClient.post('/wallet/fund/verify', { reference })
  return data
}

export async function getTransactions(
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<{ transactions: Transaction[] }>> {
  const params: Record<string, number> = {}
  if (page) params.page = page
  if (limit) params.limit = limit

  const { data } = await apiClient.get('/wallet/transactions', { params })
  return data
}