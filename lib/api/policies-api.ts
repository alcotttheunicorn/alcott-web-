import apiClient from '@/lib/api-client'
import type { ApiResponse, PaginatedResponse } from './types'

export interface PrivacyPolicy {
  id?: string
  title?: string
  content?: string
  version?: string
  effective_date?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface PrivacyPolicyPayload {
  title: string
  content: string
  version?: string
  effective_date?: string
  is_active?: boolean
}

function normalizeLegalResponse<T>(response: unknown): T[] {
  const raw = response as unknown
  if (Array.isArray(raw)) return raw as T[]
  if (!raw || typeof raw !== 'object') return []

  const record = raw as Record<string, unknown>
  const candidates = [
    record.privacy_policies,
    record.terms,
    record.terms_of_use,
    record.policies,
    record.data,
    record.items,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as T[]
  }

  return [record as T]
}

export async function getAdminPolicies(
  params?: { page?: number; limit?: number },
): Promise<PaginatedResponse<{ privacy_policies: PrivacyPolicy[] }>> {
  const { data } = await apiClient.get('/admin/privacy-policies', { params })
  return data
}

export async function getPolicies(): Promise<ApiResponse<PrivacyPolicy[]>> {
  const { data } = await apiClient.get('/privacy-policy')
  return data
}

export async function getTerms(): Promise<ApiResponse<PrivacyPolicy[]>> {
  try {
    const { data } = await apiClient.get('/terms-of-use')
    return { ...(data ?? {}), data: normalizeLegalResponse<PrivacyPolicy>(data?.data ?? data) }
  } catch (error) {
    if ((error as { response?: { status?: number } })?.response?.status === 404) {
      return { status: 'success', data: [] }
    }
    throw error
  }
}

export async function getAdminTermsOfUse(
  params?: { page?: number; limit?: number },
): Promise<PaginatedResponse<{ terms_of_use: PrivacyPolicy[] }>> {
  const { data } = await apiClient.get('/admin/terms-of-use', { params })
  return data
}

export async function getAdminTermOfUse(id: string): Promise<ApiResponse<PrivacyPolicy>> {
  const { data } = await apiClient.get(`/admin/terms-of-use/${id}`)
  return data
}

export async function createAdminTermOfUse(payload: PrivacyPolicyPayload): Promise<ApiResponse<PrivacyPolicy>> {
  const { data } = await apiClient.post('/admin/terms-of-use', payload)
  return data
}

export async function updateAdminTermOfUse(
  id: string,
  payload: Partial<PrivacyPolicyPayload>,
): Promise<ApiResponse<PrivacyPolicy>> {
  const { data } = await apiClient.patch(`/admin/terms-of-use/${id}`, payload)
  return data
}

export async function deleteAdminTermOfUse(id: string): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.delete(`/admin/terms-of-use/${id}`)
  return data
}

export async function getAdminPolicy(id: string): Promise<ApiResponse<PrivacyPolicy>> {
  const { data } = await apiClient.get(`/admin/privacy-policies/${id}`)
  return data
}

export async function createAdminPolicy(payload: PrivacyPolicyPayload): Promise<ApiResponse<PrivacyPolicy>> {
  const { data } = await apiClient.post('/admin/privacy-policies', payload)
  return data
}

export async function updateAdminPolicy(
  id: string,
  payload: Partial<PrivacyPolicyPayload>,
): Promise<ApiResponse<PrivacyPolicy>> {
  const { data } = await apiClient.patch(`/admin/privacy-policies/${id}`, payload)
  return data
}

export async function deleteAdminPolicy(id: string): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.delete(`/admin/privacy-policies/${id}`)
  return data
}

export type { PaginatedResponse }