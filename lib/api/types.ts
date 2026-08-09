export interface ApiResponse<T> {
  status: string
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  status: string
  totalItems: number
  totalPages: number
  currentPage: number
  limit: number
  data: T
}

export interface AuthUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role?: string
  is_verified?: boolean
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface ProfileData {
  profile_pic_link?: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  is_phone_verified?: boolean
  dob?: string
  address?: string
  gender?: string
  created_at?: string
}

export interface WalletBalance {
  balance: number
  currency: string
}

export interface WalletFundInit {
  authorization_url: string
  access_code: string
  reference: string
}

export interface Transaction {
  id?: string
  title?: string
  description?: string
  amount?: number
  type?: string
  status?: string
  created_at?: string
  [key: string]: unknown
}

export interface ShipmentData {
  id: string
  tracking_id: string
  status: string
  sender_name?: string
  sender_phone_number?: string
  sender_email?: string
  sender_city?: string
  sender_address?: string
  receiver_name?: string
  receiver_phone_number?: string
  receiver_email?: string
  receiver_city?: string
  receiver_address?: string
  package_category?: string
  package_weight?: number
  package_length?: number
  package_width?: number
  package_height?: number
  payment_method?: string
  price?: number
  created_at?: string
  [key: string]: unknown
}

export interface PricingResult {
  pricing_type: string
  total_price: number
  details: Record<string, unknown>
}

export interface ShipmentCreateResult {
  shipment: ShipmentData
  payment_url?: string | null
}
