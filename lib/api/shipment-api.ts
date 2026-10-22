import apiClient from '@/lib/api-client'
import type {
  ApiResponse,
  MessageResponse,
  PaginatedResponse,
  ShipmentData,
  ShipmentCreateResult,
} from './types'

export interface CreateShipmentRequest {
  sender_name: string
  sender_phone_number: string
  sender_email: string
  sender_city: string
  sender_address: string
  sender_zip_code?: string | null
  sender_address_details?: string | null
  receiver_name: string
  receiver_phone_number: string
  receiver_email: string
  receiver_city: string
  receiver_address: string
  receiver_zip_code?: string | null
  receiver_address_details?: string | null
  package_category?: string
  package_description?: string | null
  package_weight?: number
  package_length?: number
  package_width?: number
  package_height?: number
  shipment_value?: number
  shipment_value_currency?: string
}

export interface CategorySurcharge {
  id: string
  cost_per_kg: number
}

export interface ShipmentCategoryOption {
  value: string
  label: string
  // Admin-managed per-kg surcharge attached to this category (public list),
  // or null when none is set.
  surcharge?: CategorySurcharge | null
}

export async function createShipment(
  payload: CreateShipmentRequest,
): Promise<ApiResponse<ShipmentCreateResult>> {
  const { data } = await apiClient.post('/shipments', payload)
  return data
}

export interface PayShipmentRequest {
  payment_method: 'WALLET' | 'CARD'
  currency: 'NGN' | 'USD'
}

export async function payShipment(
  id: string,
  payload: PayShipmentRequest,
): Promise<ApiResponse<Record<string, unknown>>> {
  const { data } = await apiClient.post(`/shipments/${id}/pay`, payload)
  return data
}

export type UpdateShipmentRequest = Partial<Omit<CreateShipmentRequest, 'payment_method' | 'currency'>>

export async function updateShipment(
  id: string,
  payload: UpdateShipmentRequest,
): Promise<ApiResponse<ShipmentCreateResult>> {
  const { data } = await apiClient.patch(`/shipments/${id}`, payload)
  return data
}

export async function getShipments(
  params?: { status?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<{ shipments: ShipmentData[] }>> {
  const { data } = await apiClient.get('/shipments', { params })
  return data
}

export async function getShipmentById(
  id: string,
): Promise<ApiResponse<ShipmentData>> {
  const { data } = await apiClient.get(`/shipments/${id}`)
  return data
}

export async function getShipmentByTrackingId(
  trackingId: string,
): Promise<ApiResponse<ShipmentData>> {
  const { data } = await apiClient.get(`/shipments/tracking/${trackingId}`)
  return data
}

export async function getCategories(): Promise<ApiResponse<ShipmentCategoryOption[]>> {
  const { data } = await apiClient.get('/shipments/categories/list')
  return data
}

// --- Admin category management (/api/admin/categories) ---
// Categories moved from a static enum to this admin-managed table. The
// public list keeps its { value, label, surcharge } shape; `code` is
// auto-generated from the name on create and immutable afterwards.

export interface AdminCategory {
  id: string
  code: string
  name: string
  description: string | null
  is_active: boolean
  // Present when a DELETE archived the row instead of hard-deleting it.
  archived?: boolean
  surcharge?: CategorySurcharge | null
  _count?: { shipments: number }
  created_at?: string
  updated_at?: string
}

// DELETE forks: unused categories are hard-deleted ({ deleted: true });
// categories linked to shipments are archived instead (protecting FKs).
export interface CategoryDeleteResult {
  status: string
  message: string
  data: { deleted?: boolean; id?: string; code?: string; archived?: boolean; is_active?: boolean }
}

export async function getAdminCategories(
  params?: { is_active?: boolean },
): Promise<ApiResponse<AdminCategory[]>> {
  const { data } = await apiClient.get('/admin/categories', { params })
  return data
}

export async function createCategory(payload: {
  name: string
  description?: string
}): Promise<ApiResponse<AdminCategory>> {
  const { data } = await apiClient.post('/admin/categories', payload)
  return data
}

export async function updateCategory(
  id: string,
  payload: { name?: string; description?: string; is_active?: boolean },
): Promise<ApiResponse<AdminCategory>> {
  const { data } = await apiClient.patch(`/admin/categories/${id}`, payload)
  return data
}

export async function deleteCategory(id: string): Promise<CategoryDeleteResult> {
  const { data } = await apiClient.delete(`/admin/categories/${id}`)
  return data
}

export async function verifyPayment(
  reference: string,
): Promise<MessageResponse> {
  const { data } = await apiClient.post('/shipments/verify-payment', { reference })
  return data
}