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