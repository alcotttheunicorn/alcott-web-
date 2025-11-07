import apiClient from '@/lib/api-client'

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
  package_category: string
  package_weight: number
  package_length: number
  package_width: number
  package_height: number
  shipping_rate_id: string
  status: string
  payment_method: string
}

export interface CreateShipmentResponse {
  status: 'success' | 'error'
  data?: unknown
  message?: string
  [key: string]: unknown
}

export async function createShipment(payload: CreateShipmentRequest, token: string): Promise<CreateShipmentResponse> {
  const authHeader = token.trim().startsWith('Bearer ')
    ? token.trim()
    : `Bearer ${token.trim()}`

  const { data } = await apiClient.post<CreateShipmentResponse>('/shipments', payload, {
    headers: {
      Authorization: authHeader,
    },
  })
  return data
}

