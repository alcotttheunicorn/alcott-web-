export interface ApiResponse<T> {
  status: string
  data: T
  message?: string
}

// For endpoints whose success payload is just { status, message } with no
// nested `data` key — e.g. POST /wallet/fund/verify, POST /shipments/verify-payment.
// Using ApiResponse<{ message: string }> here is wrong: it expects the message
// under `data.message`, but the backend returns it at the top level.
export interface MessageResponse {
  status: string
  message: string
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

export interface PricingBreakdown {
  base_range_cost: number
  distance_cost: number
  duration_cost: number
  weight_cost: number
  [key: string]: unknown
}

export interface PricingMoney {
  amount: number
  currency: string
}

export interface PricingSlabPrice extends PricingMoney {
  min_weight: number
  max_weight: number
}

export interface PricingResult {
  pricing_type: string
  weight: number
  // PREMISE (domestic) fields:
  price?: PricingMoney
  breakdown?: PricingBreakdown
  distance_km?: number
  duration_minutes?: number
  // INTERNATIONAL_ZONE (cross-border) fields:
  export_price?: PricingSlabPrice
  import_price?: PricingSlabPrice
  zone_code?: number
  [key: string]: unknown
}


export interface PricingOverview {
  zones: number
  regions: number
  premise: Record<string, unknown>
}

export interface ZoneCountry {
  code?: string
  name?: string
  [key: string]: unknown
}

export interface ZoneSlab {
  min_weight?: number
  max_weight?: number
  from_weight?: number
  to_weight?: number
  price?: number
  [key: string]: unknown
}

export interface ZonePricing {
  zone_code?: number
  base_country_code?: string
  destination_country_codes?: ZoneCountry[]
  import_slabs?: ZoneSlab[]
  export_slabs?: ZoneSlab[]
  [key: string]: unknown
}
export interface RegionPricing {
  id?: string
  name?: string
  states?: string[]
  [key: string]: unknown
}

export interface RegionZoneRateCard {
  id?: string
  zone_code?: number
  currency?: string
  slabs?: ZoneSlab[]
  [key: string]: unknown
}

export interface PremisePricing {
  base_range_cost: number
  cost_per_km: number
  cost_per_minute: number
  cost_per_kg: number
  [key: string]: unknown
}

export interface ShipmentQuote {
  pricing_type?: string
  price_ngn?: number
  currency?: string
}

export interface ShipmentCreateResult {
  shipment: ShipmentData
  quote?: ShipmentQuote
}