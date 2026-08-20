import apiClient from '@/lib/api-client'
import type { PaginatedResponse, ShipmentData, AuthUser } from './types'

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
  params?: { page?: number; limit?: number },
): Promise<PaginatedResponse<AdminUser[]>> {
  const { data } = await apiClient.get('/admin/users', { params })
  return data
}

export async function getAdminShipments(
  params?: { status?: string; user_id?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<ShipmentData[]>> {
  const { data } = await apiClient.get('/admin/shipments', { params })
  return data
}

export async function getAdminActivityLogs(
  params?: { user_id?: string; action?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<ActivityLog[]>> {
  const { data } = await apiClient.get('/admin/activity-logs', { params })
  return data
}