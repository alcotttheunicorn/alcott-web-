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
  receiver_name: string
  receiver_phone_number: string
  receiver_email: string
  receiver_city: string
  receiver_address: string
  package_category?: string
  package_weight?: number
  package_length?: number
  package_width?: number
  package_height?: number
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

export async function getCategories(): Promise<ApiResponse<string[]>> {
  const { data } = await apiClient.get('/shipments/categories/list')
  return data
}

export async function verifyPayment(
  reference: string,
): Promise<MessageResponse> {
  const { data } = await apiClient.post('/shipments/verify-payment', { reference })
  return data
}