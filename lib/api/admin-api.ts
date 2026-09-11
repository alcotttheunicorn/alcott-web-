import apiClient from '@/lib/api-client'
import type { ApiResponse, MessageResponse, PaginatedResponse, ShipmentData, AuthUser } from './types'

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

export interface AdminShipmentEvent {
  id?: string
  event_id?: string
  event_name?: string
  location?: string
  created_at?: string
  [key: string]: unknown
}

export interface AdminEvent {
  id?: string
  name?: string
  description?: string
  created_at?: string
  [key: string]: unknown
}

export interface RateCheck {
  id?: string
  sender_address?: string
  receiver_address?: string
  weight?: number
  sender_email?: string
  sender_phone_number?: string
  price?: number
  total_price?: number
  currency?: string
  created_at?: string
  [key: string]: unknown
}

export interface AdminShipmentDetail extends ShipmentData {
  payment_status?: string
  owner?: AuthUser
  [key: string]: unknown
}

export async function getAdminUsers(
  params?: { page?: number; limit?: number },
): Promise<PaginatedResponse<{ users: AdminUser[] }>> {
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

export async function getAdminShipment(id: string): Promise<ApiResponse<AdminShipmentDetail>> {
  const { data } = await apiClient.get(`/admin/shipments/${id}`)
  return data
}

export async function updateAdminShipment(
  id: string,
  payload: Partial<ShipmentData> & { min_delivery_days?: number; max_delivery_days?: number },
): Promise<ApiResponse<AdminShipmentDetail>> {
  const { data } = await apiClient.patch(`/admin/shipments/${id}`, payload)
  return data
}

export async function completeAdminShipment(
  id: string,
  payload: { payment_method: 'USER_WALLET' | 'CARD' | 'ADMIN_WALLET'; currency?: 'NGN' | 'USD' },
): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.post(`/admin/shipments/${id}/complete`, payload)
  return data
}

export async function cancelAdminShipment(id: string): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.post(`/admin/shipments/${id}/cancel`)
  return data
}

export async function startProcessingShipment(id: string): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.post(`/admin/shipments/${id}/start-processing`)
  return data
}

export async function deliverShipment(id: string): Promise<ApiResponse<unknown>> {
  const { data } = await apiClient.post(`/admin/shipments/${id}/deliver`)
  return data
}

export async function getShipmentEvents(id: string): Promise<ApiResponse<AdminShipmentEvent[]>> {
  const { data } = await apiClient.get(`/admin/shipments/${id}/events`)
  return data
}

export async function appendShipmentEvent(
  id: string,
  payload: { event_id: string; location: string },
): Promise<ApiResponse<AdminShipmentEvent>> {
  const { data } = await apiClient.post(`/admin/shipments/${id}/events`, payload)
  return data
}

export async function getAdminEvents(
  params?: { search?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<AdminEvent[]>> {
  const { data } = await apiClient.get('/admin/events', { params })
  return data
}

export async function getAdminEvent(id: string): Promise<ApiResponse<AdminEvent>> {
  const { data } = await apiClient.get(`/admin/events/${id}`)
  return data
}

export async function createAdminEvent(payload: {
  name: string
  description?: string
}): Promise<ApiResponse<AdminEvent>> {
  const { data } = await apiClient.post('/admin/events', payload)
  return data
}

export async function updateAdminEvent(
  id: string,
  payload: { name?: string; description?: string },
): Promise<ApiResponse<AdminEvent>> {
  const { data } = await apiClient.patch(`/admin/events/${id}`, payload)
  return data
}

export async function deleteAdminEvent(id: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete(`/admin/events/${id}`)
  return data
}

export async function getAdminRateChecks(
  params?: { email?: string; phone_number?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<{ rateChecks: RateCheck[] }>> {
  const { data } = await apiClient.get('/admin/rate-checks', { params })
  return data
}