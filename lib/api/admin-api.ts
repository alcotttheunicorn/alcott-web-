import apiClient from '@/lib/api-client'
import type { PaginatedResponse, ShipmentData, AuthUser } from './types'

function authHeader(token: string) {
  const t = token.trim()
  return t.startsWith('Bearer ') ? t : `Bearer ${t}`
}

export interface AdminUser extends AuthUser {
  phone_number?: string
  is_verified?: boolean
  created_at?: string
  [key: string]: unknown
}

export interface ActivityLog {
  id?: string
  user_id?: string
  action?: string
  created_at?: string
  [key: string]: unknown
}

export async function getAdminUsers(
  token: string,
  params?: { page?: number; limit?: number },
): Promise<PaginatedResponse<AdminUser[]>> {
  const { data } = await apiClient.get('/admin/users', {
    headers: { Authorization: authHeader(token) },
    params,
  })
  return data
}

export async function getAdminShipments(
  token: string,
  params?: { status?: string; user_id?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<ShipmentData[]>> {
  const { data } = await apiClient.get('/admin/shipments', {
    headers: { Authorization: authHeader(token) },
    params,
  })
  return data
}

export async function getAdminActivityLogs(
  token: string,
  params?: { user_id?: string; action?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<ActivityLog[]>> {
  const { data } = await apiClient.get('/admin/activity-logs', {
    headers: { Authorization: authHeader(token) },
    params,
  })
  return data
}