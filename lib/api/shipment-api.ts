import apiClient from '@/lib/api-client'
import type {
  ApiResponse,
  MessageResponse,
  PaginatedResponse,
  ShipmentData,
  ShipmentCreateResult,
} from './types'

function authHeader(token: string) {
  const t = token.trim()
  return t.startsWith('Bearer ') ? t : `Bearer ${t}`
}

export interface CreateShipmentRequest {
  payment_method: 'WALLET' | 'CARD'
  price: number
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
  token: string,
): Promise<ApiResponse<ShipmentCreateResult>> {
  const { data } = await apiClient.post('/shipments', payload, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function getShipments(
  token: string,
  params?: { status?: string; page?: number; limit?: number },
): Promise<PaginatedResponse<ShipmentData[]>> {
  const { data } = await apiClient.get('/shipments', {
    headers: { Authorization: authHeader(token) },
    params,
  })
  return data
}

export async function getShipmentById(
  token: string,
  id: string,
): Promise<ApiResponse<ShipmentData>> {
  const { data } = await apiClient.get(`/shipments/${id}`, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function getShipmentByTrackingId(
  token: string,
  trackingId: string,
): Promise<ApiResponse<ShipmentData>> {
  const { data } = await apiClient.get(`/shipments/tracking/${trackingId}`, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function getCategories(
  token: string,
): Promise<ApiResponse<string[]>> {
  const { data } = await apiClient.get('/shipments/categories/list', {
    headers: { Authorization: authHeader(token) },
  })
  return data
}

export async function verifyPayment(
  token: string,
  reference: string,
): Promise<MessageResponse> {
  const { data } = await apiClient.post('/shipments/verify-payment', { reference }, {
    headers: { Authorization: authHeader(token) },
  })
  return data
}
