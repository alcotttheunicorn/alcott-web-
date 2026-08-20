import type { ShipmentOptions } from '@/lib/types/shipment-types'

export const shippingOptions: ShipmentOptions = [
    { id: 'regular', label: 'Regular', eta: '3-4 days', price: 12000, rateId: 'shipping-rate-regular', type: 'REGULAR', currency: 'NGN' },
    { id: 'cargo', label: 'Cargo', eta: '3-5 days', price: 18000, rateId: 'shipping-rate-cargo', type: 'CARGO', currency: 'NGN' },
    { id: 'express', label: 'Express', eta: '1-2 days', price: 24000, rateId: 'shipping-rate-express', type: 'EXPRESS', currency: 'NGN' },
]
