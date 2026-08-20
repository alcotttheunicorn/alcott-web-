'use client';

import { useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { createShipment, getCategories, type CreateShipmentRequest } from '@/lib/api/shipment-api'
import { getBalance } from '@/lib/api/wallet-api'
import { useAuth } from '@/hooks/use-auth'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { toast } from '@/components/ui/use-toast'
import { Stepper } from '@/components/shipment/Stepper'
import { ContactStep } from '@/components/shipment/ContactStep'
import { PackageStep } from '@/components/shipment/PackageStep'
import { PaymentStep } from '@/components/shipment/PaymentStep'
import { ReviewStep } from '@/components/shipment/ReviewStep'
import { shippingOptions } from '@/lib/shipment-constants'
import { useShipmentWizard } from '@/hooks/use-shipment-wizard'
import { AuthGuard } from '@/components/auth-guard';
import type {
  ShipmentContact,
  ShipmentOption,
  ShipmentPaymentSelection,
  ShipmentStepKey,
  ShipmentSteps,
  ShipmentPackage,
  ShipmentWeightUnit,
  ShipmentDimensionUnit,
} from '@/lib/types/shipment-types'

const steps: ShipmentSteps = [
  { key: 'sender', label: 'Sender' },
  { key: 'receiver', label: 'Receiver' },
  { key: 'package', label: 'Package' },
  { key: 'payment', label: 'Payment' },
  { key: 'finish', label: 'Finish' },
]

type StepKey = ShipmentStepKey

const weightUnitOptions: ShipmentWeightUnit[] = ['kg', 'lb']
const dimensionUnitOptions: ShipmentDimensionUnit[] = ['cm', 'in']

const initialContact: ShipmentContact = {
  name: '',
  phone: '',
  email: '',
  city: '',
  address: '',
}

const initialPackage: ShipmentPackage = {
  category: '',
  description: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  shippingOption: 'regular',
  weightUnit: 'kg',
  dimensionUnit: 'cm',
}

const initialPayment: ShipmentPaymentSelection = {
  method: 'wallet',
}

function NewShipmentContent() {
  const router = useRouter()
  const { token } = useAuth()

  const { data: categories = [] } = useQuery({
    queryKey: ['shipment-categories', token],
    queryFn: () => getCategories().then((res) => (Array.isArray(res.data) ? res.data : [])),
    enabled: !!token,
  })

  const { data: walletBalance = null } = useQuery({
    queryKey: ['wallet-balance', token],
    queryFn: () => getBalance().then((res) => res.data?.balance ?? null),
    enabled: !!token,
  })

  const sanitizePhoneInput = (value: string) => {
    const stripped = value.replace(/[^0-9+]/g, '')
    if (!stripped) return ''
    if (stripped.startsWith('+')) {
      return `+${stripped.slice(1).replace(/\+/g, '')}`
    }
    return stripped.replace(/\+/g, '')
  }

  const sanitizeDecimalInput = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '')
    const [integer, fraction] = cleaned.split('.')
    if (fraction !== undefined) {
      return `${integer}${fraction ? `.${fraction.replace(/\./g, '')}` : ''}`
    }
    return integer
  }

  const ensureIntlPhone = (value: string, defaultPrefix: string) => {
    const trimmed = value.replace(/[^0-9+]/g, '')
    if (!trimmed) return ''
    if (trimmed.startsWith('00')) return `+${trimmed.slice(2)}`
    if (trimmed.startsWith('+')) return trimmed
    if (trimmed.startsWith('0')) return `${defaultPrefix}${trimmed.slice(1)}`
    return `${defaultPrefix}${trimmed}`
  }

  const {
    currentStep,
    activeIndex,
    moveToNext,
    moveToPrevious,
    canMoveForward,
    sender,
    setSender,
    receiver,
    setReceiver,
    pkg,
    setPkg,
    payment,
    setPayment,
  } = useShipmentWizard({
    steps,
    initialSender: initialContact,
    initialReceiver: initialContact,
    initialPackage,
    initialPayment,
  })

  const createShipmentMutation = useMutation({
    mutationFn: (payload: CreateShipmentRequest) => createShipment(payload),
  })
  const isSubmitting = createShipmentMutation.isPending

  const handleBack = () => {
    if (activeIndex <= 0) {
      router.back()
      return
    }
    moveToPrevious()
  }

  const shippingSelection = useMemo<ShipmentOption>(
    () => shippingOptions.find((opt) => opt.id === pkg.shippingOption) || shippingOptions[0],
    [pkg.shippingOption]
  )

  const handleConfirmShipment = () => {
    if (!token) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in again to create a shipment.',
      })
      router.push('/sign-in')
      return
    }

    const toNumber = (value: string) => {
      const parsed = parseFloat(value)
      return Number.isFinite(parsed) ? parsed : 0
    }

    const weightInKg = pkg.weightUnit === 'lb' ? toNumber(pkg.weight) * 0.453592 : toNumber(pkg.weight)
    const lengthInCm = pkg.dimensionUnit === 'in' ? toNumber(pkg.length) * 2.54 : toNumber(pkg.length)
    const widthInCm = pkg.dimensionUnit === 'in' ? toNumber(pkg.width) * 2.54 : toNumber(pkg.width)
    const heightInCm = pkg.dimensionUnit === 'in' ? toNumber(pkg.height) * 2.54 : toNumber(pkg.height)

    const payload: CreateShipmentRequest = {
      payment_method: payment.method.toUpperCase() as 'WALLET' | 'CARD',
      price: shippingSelection.price,
      sender_name: sender.name.trim(),
      sender_phone_number: ensureIntlPhone(sender.phone, '+234'),
      sender_email: sender.email.trim(),
      sender_city: sender.city.trim(),
      sender_address: sender.address.trim(),
      receiver_name: receiver.name.trim(),
      receiver_phone_number: ensureIntlPhone(receiver.phone, '+1'),
      receiver_email: receiver.email.trim(),
      receiver_city: receiver.city.trim(),
      receiver_address: receiver.address.trim(),
      package_category: (pkg.category || 'GENERAL').trim().toUpperCase(),
      package_weight: parseFloat(weightInKg.toFixed(2)),
      package_length: parseFloat(lengthInCm.toFixed(2)),
      package_width: parseFloat(widthInCm.toFixed(2)),
      package_height: parseFloat(heightInCm.toFixed(2)),
    }

    createShipmentMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response?.data?.shipment) {
          window.sessionStorage.setItem('lastCreatedShipment', JSON.stringify(response.data.shipment))
        }

        if (response?.data?.payment_url) {
          window.location.href = response.data.payment_url
          return
        }

        toast({
          title: 'Shipment created',
          description: 'Your shipment has been created successfully.',
        })
        router.push('/shipment/new/success')
      },
      onError: (error: any) => {
        console.error('Failed to create shipment', error)
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Unable to create shipment. Please try again.'
        toast({ title: 'Shipment creation failed', description: errorMessage })
      },
    })
  }

  return (
    <UserAppLayout contentBgClass="bg-[#F8F9FC]">
        <div className="px-4 lg:px-6 py-6 lg:py-8">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {currentStep === 'sender' ? 'New Shipment' : 'Make Order'}
              </h1>
              <p className="text-sm text-gray-500">Step {activeIndex + 1} of {steps.length}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:gap-2">
            <Stepper steps={steps} activeIndex={activeIndex} />

            <div className="max-w-4xl w-full mx-auto space-y-5 lg:space-y-6">
              {currentStep === 'sender' && (
                <ContactStep
                  variant="sender"
                  data={sender}
                  onChange={setSender}
                  onContinue={moveToNext}
                  canContinue={canMoveForward}
                  sanitizePhone={sanitizePhoneInput}
                />
              )}
              {currentStep === 'receiver' && (
                <ContactStep
                  variant="receiver"
                  data={receiver}
                  onChange={setReceiver}
                  onContinue={moveToNext}
                  canContinue={canMoveForward}
                  sanitizePhone={sanitizePhoneInput}
                />
              )}
              {currentStep === 'package' && (
                <PackageStep
                  data={pkg}
                  onChange={setPkg}
                  shippingSelection={shippingSelection}
                  onContinue={moveToNext}
                  canContinue={canMoveForward}
                  weightUnits={weightUnitOptions}
                  dimensionUnits={dimensionUnitOptions}
                  sanitizeDecimal={sanitizeDecimalInput}
                  categories={categories}
                />
              )}
              {currentStep === 'payment' && (
                <PaymentStep data={payment} onChange={setPayment} onContinue={moveToNext} canContinue={canMoveForward} walletBalance={walletBalance} />
              )}
              {currentStep === 'finish' && (
                <ReviewStep
                  sender={sender}
                  receiver={receiver}
                  pkg={pkg}
                  shippingSelection={shippingSelection}
                  payment={payment}
                  onConfirm={handleConfirmShipment}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
    </UserAppLayout>
  )
}

export default function NewShipmentPage() {
  return (
    <AuthGuard>
      <NewShipmentContent />
    </AuthGuard>
  )
}
