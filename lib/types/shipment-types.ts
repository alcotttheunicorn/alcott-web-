export type ShipmentStepKey = 'sender' | 'receiver' | 'package' | 'payment' | 'finish'

export interface ShipmentStep {
  key: ShipmentStepKey
  label: string
}

export type ShipmentSteps = ReadonlyArray<ShipmentStep>

export type ShipmentOptionId = 'regular' | 'cargo' | 'express'

export interface ShipmentOption {
  id: ShipmentOptionId
  label: string
  eta: string
  price: number
  rateId?: string
  currency?: string
  type?: string
}

export type ShipmentOptions = ReadonlyArray<ShipmentOption>

export type PaymentMethodId = 'wallet' | 'card'

export interface ShipmentPaymentMethod {
  id: PaymentMethodId
  label: string
  details: string
}

export type ShipmentPaymentMethods = ReadonlyArray<ShipmentPaymentMethod>

export interface ShipmentContact {
  name: string
  phone: string
  email: string
  city: string
  address: string
}

export type ShipmentWeightUnit = 'kg' | 'lb'
export type ShipmentDimensionUnit = 'cm' | 'in'

export interface ShipmentPackage {
  category: string
  description: string
  weight: string
  length: string
  width: string
  height: string
  shippingOption: ShipmentOptionId
  weightUnit: ShipmentWeightUnit
  dimensionUnit: ShipmentDimensionUnit
}

export interface ShipmentPaymentSelection {
  method: PaymentMethodId
}

export interface ShipmentFormState {
  sender: ShipmentContact
  receiver: ShipmentContact
  package: ShipmentPackage
  payment: ShipmentPaymentSelection
}

