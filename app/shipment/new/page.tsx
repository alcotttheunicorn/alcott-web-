'use client';

import { useEffect, useRef, useState } from 'react'
import type { SVGProps } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { CreateShipmentRequest } from '@/lib/api/shipment-api'
import { useShipmentCategories, useCreateShipment, usePayShipment } from '@/hooks/use-shipments'
import { useCheckPricingAuth, useExchangeRate } from '@/hooks/use-pricing'
import { useWalletBalance } from '@/hooks/use-wallet'
import { useCurrency } from '@/components/providers/currency-provider'
import { convertCurrency, formatCurrency } from '@/lib/currency'
import { useAuth } from '@/hooks/use-auth'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { toast } from '@/components/ui/use-toast'
import { Stepper } from '@/components/shipment/Stepper'
import { FormSection } from '@/components/shipment/FormSection'
import { ContinueButton } from '@/components/shipment/ContinueButton'
import { InputRow } from '@/components/shipment/InputRow'
import { TextareaRow } from '@/components/shipment/TextareaRow'
import { CountryCodeSelect } from '@/components/shipment/CountryCodeSelect'
import { getDialCode, validatePhoneNumber } from '@/lib/countries'
import { useShipmentWizard } from '@/hooks/use-shipment-wizard'
import type {
  ShipmentContact,
  ShipmentPaymentSelection,
  ShipmentStepKey,
  ShipmentSteps,
  ShipmentPackage,
  ShipmentWeightUnit,
  ShipmentDimensionUnit,
} from '@/lib/types/shipment-types'

// Step configuration
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
  zipCode: '',
  addressDetails: '',
  countryCode: 'NG',
}

const initialPackage: ShipmentPackage = {
  category: '',
  description: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  shippingOption: 'express',
  weightUnit: 'kg',
  dimensionUnit: 'cm',
}

const initialPayment: ShipmentPaymentSelection = {
  method: 'wallet',
}

export default function NewShipmentPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { data: categories = [] } = useShipmentCategories()
  const { data: balance } = useWalletBalance()
  const walletBalance = balance ?? null
  const { currency } = useCurrency()
  const { data: exchangeRate } = useExchangeRate()
  const createMutation = useCreateShipment()
  const payMutation = usePayShipment()
  const pricingMutation = useCheckPricingAuth()

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
    initialReceiver: { ...initialContact, countryCode: 'US' },
    initialPackage,
    initialPayment,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quotedAmountNGN, setQuotedAmountNGN] = useState<number | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState(false)
  const [quoteRetry, setQuoteRetry] = useState(0)
  // Tracks the inputs the current quote was fetched for, so stepping from
  // payment -> finish reuses the quote instead of blanking it and refetching.
  const quoteSignatureRef = useRef<string | null>(null)

  const handleBack = () => {
    if (activeIndex <= 0) {
      router.back()
      return
    }
    moveToPrevious()
  }

  const totalAmount = quotedAmountNGN

  useEffect(() => {
    // The quote is needed on the payment step too, so the amount is visible
    // while the user is still choosing how to pay.
    if (currentStep !== 'payment' && currentStep !== 'finish') return
    const weight = parseFloat(pkg.weight)
    if (!sender.address.trim() || !receiver.address.trim() || !Number.isFinite(weight) || weight <= 0) return

    const weightInKg = pkg.weightUnit === 'lb' ? weight * 0.453592 : weight
    const request = {
      sender_address: sender.address.trim(),
      receiver_address: receiver.address.trim(),
      weight: Number(weightInKg.toFixed(2)),
      sender_email: sender.email.trim() || undefined,
      sender_phone_number: ensureIntlPhone(sender.phone, getDialCode(sender.countryCode)) || undefined,
    }
    const signature = JSON.stringify(request)

    if (quoteSignatureRef.current === signature && quotedAmountNGN != null) return
    quoteSignatureRef.current = signature

    let cancelled = false
    setQuoteLoading(true)
    setQuoteError(false)

    pricingMutation.mutateAsync(request).then((response) => {
      if (cancelled) return
      const result = response.data
      const quoteParts = typeof result.price?.amount === 'number'
        ? [{ amount: result.price.amount, currency: result.price.currency }]
        : [result.export_price, result.import_price]
            .filter((part): part is NonNullable<typeof part> => typeof part?.amount === 'number')
            .map((part) => ({ amount: part.amount, currency: part.currency }))
      const amountsInNGN = quoteParts.map((part) => convertCurrency(
        part.amount,
        part.currency === 'USD' ? 'USD' : 'NGN',
        'NGN',
        exchangeRate?.ngn_per_usd,
      ))
      const amount = amountsInNGN.every((part): part is number => part != null)
        ? amountsInNGN.reduce((sum, part) => sum + part, 0)
        : null
      if (amount != null && amount > 0) setQuotedAmountNGN(amount)
      else {
        setQuotedAmountNGN(null)
        setQuoteError(true)
      }
    }).catch(() => {
      if (cancelled) return
      setQuotedAmountNGN(null)
      setQuoteError(true)
    }).finally(() => {
      if (!cancelled) setQuoteLoading(false)
    })

    return () => { cancelled = true }
  }, [currentStep, sender.address, receiver.address, pkg.weight, pkg.weightUnit, sender.email, sender.phone, sender.countryCode, quoteRetry, exchangeRate?.ngn_per_usd, quotedAmountNGN])

  const senderPhoneValidation = validatePhoneNumber(sender.phone, sender.countryCode)
  const receiverPhoneValidation = validatePhoneNumber(receiver.phone, receiver.countryCode)
  const senderCanContinue = canMoveForward && senderPhoneValidation.valid
  const receiverCanContinue = canMoveForward && receiverPhoneValidation.valid

  const handleConfirmShipment = async () => {
    if (typeof window === 'undefined') return

    if (!token) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in again to create a shipment.',
      })
      router.push('/sign-in')
      return
    }

    if (quotedAmountNGN == null) {
      toast({ title: 'Shipment quote unavailable', description: 'Refresh the quote before continuing to payment.' })
      return
    }

    // Step 4 is the single source of truth for how this order is paid for.
    const normalizedMethod = payment.method === 'card' ? 'card' : 'wallet'
    const walletHasSufficientBalance = walletBalance != null && totalAmount != null && walletBalance >= totalAmount

    if (normalizedMethod === 'wallet' && !walletHasSufficientBalance) {
      toast({
        title: 'Insufficient wallet balance',
        description: `Your wallet balance is ₦${(walletBalance ?? 0).toLocaleString()}. Add funds or switch to paying by card.`,
      })
      return
    }

    const selectedPaymentMethod = normalizedMethod === 'wallet' ? 'WALLET' : 'CARD'

    const toNumber = (value: string) => {
      const parsed = parseFloat(value)
      return Number.isFinite(parsed) ? parsed : 0
    }

    const weightInKg = pkg.weightUnit === 'lb' ? toNumber(pkg.weight) * 0.453592 : toNumber(pkg.weight)
    const lengthInCm = pkg.dimensionUnit === 'in' ? toNumber(pkg.length) * 2.54 : toNumber(pkg.length)
    const widthInCm = pkg.dimensionUnit === 'in' ? toNumber(pkg.width) * 2.54 : toNumber(pkg.width)
    const heightInCm = pkg.dimensionUnit === 'in' ? toNumber(pkg.height) * 2.54 : toNumber(pkg.height)

    const payload: CreateShipmentRequest = {
      sender_name: sender.name.trim(),
      sender_phone_number: ensureIntlPhone(sender.phone, getDialCode(sender.countryCode)),
      sender_email: sender.email.trim(),
      sender_city: sender.city.trim(),
      sender_address: sender.address.trim(),
      sender_zip_code: sender.zipCode.trim() || null,
      sender_address_details: sender.addressDetails.trim() || null,
      receiver_name: receiver.name.trim(),
      receiver_phone_number: ensureIntlPhone(receiver.phone, getDialCode(receiver.countryCode)),
      receiver_email: receiver.email.trim(),
      receiver_city: receiver.city.trim(),
      receiver_address: receiver.address.trim(),
      receiver_zip_code: receiver.zipCode.trim() || null,
      receiver_address_details: receiver.addressDetails.trim() || null,
      package_category: (pkg.category || 'OTHER').trim().toUpperCase(),
      package_description: pkg.description.trim() || null,
      package_weight: parseFloat(weightInKg.toFixed(2)),
      package_length: parseFloat(lengthInCm.toFixed(2)),
      package_width: parseFloat(widthInCm.toFixed(2)),
      package_height: parseFloat(heightInCm.toFixed(2)),
    }

    try {
      setIsSubmitting(true)
      const response = await createMutation.mutateAsync(payload)
      const rawData = response?.data && typeof response.data === 'object' ? response.data : null
      const shipment = rawData && typeof rawData === 'object' && 'shipment' in rawData ? (rawData as { shipment?: { id?: string } }).shipment : rawData
      const shipmentId = shipment && typeof shipment === 'object' && 'id' in shipment ? String((shipment as { id?: string }).id) : ''

      if (!shipmentId) {
        throw new Error('Shipment was created, but no shipment ID was returned.')
      }

      if (rawData && typeof rawData === 'object') {
        window.sessionStorage.setItem('lastCreatedShipment', JSON.stringify(rawData))
      }

      const serverQuote = rawData && typeof rawData === 'object' && 'quote' in rawData
        ? (rawData as { quote?: { price_ngn?: number } }).quote?.price_ngn
        : undefined
      if (typeof serverQuote === 'number' && Math.abs(serverQuote - quotedAmountNGN) > 0.01) {
        toast({
          title: 'Shipment price updated',
          description: `The confirmed quote is ₦${serverQuote.toLocaleString()}. Review and pay from the order details.`,
        })
        router.push(`/orders/${shipmentId}`)
        return
      }

      let paymentResponse
      try {
        paymentResponse = await payMutation.mutateAsync({
          id: shipmentId,
          payload: { payment_method: selectedPaymentMethod, currency: 'NGN' },
        })
      } catch (paymentError) {
        const paymentErrorMessage =
          (paymentError as any)?.response?.data?.message ||
          (paymentError as Error).message ||
          'Payment could not be started.'
        toast({
          title: 'Shipment created, payment pending',
          description: `${paymentErrorMessage} You can retry payment from the order details.`,
        })
        router.push(`/orders/${shipmentId}`)
        return
      }

      if (normalizedMethod === 'card') {
        const paymentData = (paymentResponse as any)?.data as Record<string, unknown> | undefined
        const authorizationUrl =
          paymentData?.authorization_url ||
          (paymentResponse as any)?.authorization_url ||
          paymentData?.checkout_url ||
          (paymentResponse as any)?.checkout_url

        if (authorizationUrl) {
          // Persist the reference BEFORE leaving for Paystack so the return trip
          // can still confirm the payment if the callback drops ?reference= or
          // the user refreshes. sessionStorage survives the cross-site redirect.
          const reference = paymentData?.reference ?? (paymentResponse as any)?.reference
          if (typeof reference === 'string' && reference) {
            try {
              window.sessionStorage.setItem('alcott_pending_shipment_ref', reference)
              window.sessionStorage.setItem('alcott_pending_shipment_id', shipmentId)
            } catch {
              // ignore storage errors
            }
          }
          window.location.href = authorizationUrl
          return
        }
        toast({
          title: 'Shipment created, payment pending',
          description: 'Paystack did not return a checkout link. You can retry payment from the order details.',
        })
        router.push(`/orders/${shipmentId}`)
        return
      }

      toast({
        title: 'Shipment created',
        description: normalizedMethod === 'wallet' ? 'Your shipment has been paid from wallet.' : 'Your shipment was created successfully.',
      })

      router.push('/shipment/new/success')
    } catch (error) {
      console.error('Failed to create shipment', error)
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        (error as Error).message ||
        'Unable to create shipment. Please try again.'
      toast({ title: 'Shipment booking failed', description: errorMessage })
      setIsSubmitting(false)
    }
  }

  return (
    <UserAppLayout activeNav="orders" searchOnNavigateToSearchPage={false}>
      <div className="mx-auto w-full max-w-8xl px-4 py-4 lg:px-6 lg:py-6">
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

          <div className="max-w-8xl w-full mx-auto space-y-5 lg:space-y-6">
            {currentStep === 'sender' && (
              <SenderForm
                data={sender}
                onChange={setSender}
                onContinue={moveToNext}
                canContinue={senderCanContinue}
                sanitizePhone={sanitizePhoneInput}
                phoneError={senderPhoneValidation.valid ? undefined : senderPhoneValidation.message}
              />
            )}
            {currentStep === 'receiver' && (
              <ReceiverForm
                data={receiver}
                onChange={setReceiver}
                onContinue={moveToNext}
                canContinue={receiverCanContinue}
                sanitizePhone={sanitizePhoneInput}
                phoneError={receiverPhoneValidation.valid ? undefined : receiverPhoneValidation.message}
              />
            )}
            {currentStep === 'package' && (
              <PackageForm
                data={pkg}
                onChange={setPkg}
                onContinue={moveToNext}
                canContinue={canMoveForward}
                weightUnits={weightUnitOptions}
                dimensionUnits={dimensionUnitOptions}
                sanitizeDecimal={sanitizeDecimalInput}
                categories={categories}
              />
            )}
            {currentStep === 'payment' && (
              <PaymentForm
                data={payment}
                onChange={setPayment}
                onContinue={moveToNext}
                canContinue={canMoveForward}
                walletBalance={walletBalance}
                totalAmount={totalAmount}
                quoteLoading={quoteLoading}
                quoteError={quoteError}
                onRefreshQuote={() => {
                  quoteSignatureRef.current = null
                  setQuoteRetry((current) => current + 1)
                }}
              />
            )}
            {currentStep === 'finish' && (
              <ReviewSummary
                sender={sender}
                receiver={receiver}
                pkg={pkg}
                payment={payment}
                onConfirm={handleConfirmShipment}
                onEditPayment={moveToPrevious}
                isSubmitting={isSubmitting}
                totalAmount={totalAmount}
                walletBalance={walletBalance}
                displayCurrency={currency}
                ngnPerUsd={exchangeRate?.ngn_per_usd}
                quoteLoading={quoteLoading}
                quoteError={quoteError}
                onRefreshQuote={() => {
                  quoteSignatureRef.current = null
                  setQuoteRetry((current) => current + 1)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </UserAppLayout>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Form Sections                                */
/* -------------------------------------------------------------------------- */

function SenderForm({
  data,
  onChange,
  onContinue,
  canContinue,
  sanitizePhone,
  phoneError,
}: {
  data: ShipmentContact
  onChange: (value: ShipmentContact) => void
  onContinue: () => void
  canContinue: boolean
  sanitizePhone: (value: string) => string
  phoneError?: string
}) {
  return (
    <FormSection title="Sender Details" subtitle="Who is sending this package?">
      <InputRow
        label="Sender Name" 
        placeholder="Sender Name" 
        value={data.name} 
        onChange={(value) => onChange({ ...data, name: value })}
        prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
      />
      <InputRow
        label="Phone Number"
        placeholder={getDialCode(data.countryCode)}
        value={data.phone}
        onChange={(value) => onChange({ ...data, phone: value })}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={20}
        pattern="[0-9+]*"
        transform={sanitizePhone}
        error={phoneError}
        prefix={
          <CountryCodeSelect
            value={data.countryCode}
            onChange={(code) => onChange({ ...data, countryCode: code })}
          />
        }
      />
      <InputRow 
        label="Email" 
        placeholder="Email" 
        type="email" 
        value={data.email} 
        onChange={(value) => onChange({ ...data, email: value })}
        prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>}
      />
      <InputRow 
        label="City / Province" 
        placeholder="City / Province" 
        value={data.city} 
        onChange={(value) => onChange({ ...data, city: value })}
        locationAutocomplete
        country={data.countryCode}
        prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
      />
      <InputRow
        label="Address Details"
        placeholder="Address Details" 
        value={data.address} 
        onChange={(value) => onChange({ ...data, address: value })}
        locationAutocomplete
        country={data.countryCode}
      />
      <InputRow label="ZIP / Postal Code" placeholder="ZIP / Postal Code" value={data.zipCode} onChange={(value) => onChange({ ...data, zipCode: value })} autoComplete="postal-code" />
      <TextareaRow label="Extra address details (optional)" placeholder="Apartment, suite, landmark, delivery instructions" value={data.addressDetails} onChange={(value) => onChange({ ...data, addressDetails: value })} />
      <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue} />
    </FormSection>
  )
}

function ReceiverForm({
  data,
  onChange,
  onContinue,
  canContinue,
  sanitizePhone,
  phoneError,
}: {
  data: ShipmentContact
  onChange: (value: ShipmentContact) => void
  onContinue: () => void
  canContinue: boolean
  sanitizePhone: (value: string) => string
  phoneError?: string
}) {
  return (
    <FormSection title="Receiver Details" subtitle="Who will receive this package?">
      <InputRow 
        label="Receiver Name" 
        placeholder="Receiver Name" 
        value={data.name} 
        onChange={(value) => onChange({ ...data, name: value })}
        prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
      />
      <InputRow
        label="Phone Number"
        placeholder={getDialCode(data.countryCode)}
        value={data.phone}
        onChange={(value) => onChange({ ...data, phone: value })}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={20}
        pattern="[0-9+]*"
        transform={sanitizePhone}
        error={phoneError}
        prefix={
          <CountryCodeSelect
            value={data.countryCode}
            onChange={(code) => onChange({ ...data, countryCode: code })}
          />
        }
      />
      <InputRow 
        label="Email" 
        placeholder="Email" 
        type="email" 
        value={data.email} 
        onChange={(value) => onChange({ ...data, email: value })}
        prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>}
      />
      <InputRow 
        label="City / Province" 
        placeholder="City / Province" 
        value={data.city} 
        onChange={(value) => onChange({ ...data, city: value })}
        locationAutocomplete
        country={data.countryCode}
        prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
      />
      <InputRow
        label="Address Details"
        placeholder="Address Details" 
        value={data.address} 
        onChange={(value) => onChange({ ...data, address: value })}
        locationAutocomplete
        country={data.countryCode}
      />
      <InputRow label="ZIP / Postal Code" placeholder="ZIP / Postal Code" value={data.zipCode} onChange={(value) => onChange({ ...data, zipCode: value })} autoComplete="postal-code" />
      <TextareaRow label="Extra address details (optional)" placeholder="Apartment, suite, landmark, delivery instructions" value={data.addressDetails} onChange={(value) => onChange({ ...data, addressDetails: value })} />
      <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue} />
    </FormSection>
  )
}

function PackageForm({
  data,
  onChange,
  onContinue,
  canContinue,
  weightUnits,
  dimensionUnits,
  sanitizeDecimal,
  categories,
}: {
  data: ShipmentPackage
  onChange: (value: ShipmentPackage) => void
  onContinue: () => void
  canContinue: boolean
  weightUnits: ShipmentWeightUnit[]
  dimensionUnits: ShipmentDimensionUnit[]
  sanitizeDecimal: (value: string) => string
  categories: { value: string; label: string }[]
}) {
  const [showCategoryOptions, setShowCategoryOptions] = useState(false)

  const handleWeightUnitChange = (unit: ShipmentWeightUnit) => {
    onChange({ ...data, weightUnit: unit })
  }

  const handleDimensionUnitChange = (unit: ShipmentDimensionUnit) => {
    onChange({ ...data, dimensionUnit: unit })
  }

  return (
    <FormSection title="Package Details" subtitle="Describe the package and choose shipping.">
      <div className="relative">
        <label className="text-sm font-semibold text-gray-700">Package Category</label>
        <button
          type="button"
          onClick={() => setShowCategoryOptions((prev) => !prev)}
          className="mt-2 w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100"
        >
          <span className={data.category ? 'text-gray-900' : 'text-gray-500'}>
            {categories.find((category) => category.value === data.category)?.label || (data.category || 'Select category')}
          </span>
          <CaretDownIcon className="w-4 h-4" />
        </button>
        {showCategoryOptions && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
            {categories.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">No categories available</p>
            )}
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  onChange({ ...data, category: category.value })
                  setShowCategoryOptions(false)
                }}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                  data.category === category.value ? 'bg-gray-50 font-semibold' : ''
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <TextareaRow label="Package Description" placeholder="Description" value={data.description} onChange={(value) => onChange({ ...data, description: value })} />
      <InputRow
        label="Weight"
        placeholder="Weight"
        value={data.weight}
        onChange={(value) => onChange({ ...data, weight: value })}
        type="text"
        inputMode="decimal"
        pattern="[0-9.]*"
        transform={sanitizeDecimal}
        suffix={
          <UnitSelect
            value={data.weightUnit}
            options={weightUnits}
            onChange={(unit) => handleWeightUnitChange(unit as ShipmentWeightUnit)}
          />
        }
        suffixClassName="pr-1 text-gray-900"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{/* Adjust dimension field spacing here */}
        <DimensionInput
          label="Length"
          placeholder="Length"
          value={data.length}
          onChange={(value) => onChange({ ...data, length: value })}
          unit={data.dimensionUnit}
          options={dimensionUnits}
          onUnitChange={(unit) => handleDimensionUnitChange(unit as ShipmentDimensionUnit)}
          sanitizeDecimal={sanitizeDecimal}
        />
        <DimensionInput
          label="Width"
          placeholder="Width"
          value={data.width}
          onChange={(value) => onChange({ ...data, width: value })}
          unit={data.dimensionUnit}
          options={dimensionUnits}
          onUnitChange={(unit) => handleDimensionUnitChange(unit as ShipmentDimensionUnit)}
          sanitizeDecimal={sanitizeDecimal}
        />
        <DimensionInput
          label="Height"
          placeholder="Height"
          value={data.height}
          onChange={(value) => onChange({ ...data, height: value })}
          unit={data.dimensionUnit}
          options={dimensionUnits}
          onUnitChange={(unit) => handleDimensionUnitChange(unit as ShipmentDimensionUnit)}
          sanitizeDecimal={sanitizeDecimal}
        />
      </div>
      <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue} />
    </FormSection>
  )
}

function PaymentForm({
  data,
  onChange,
  onContinue,
  canContinue,
  walletBalance,
  totalAmount,
  quoteLoading,
  quoteError,
  onRefreshQuote,
}: {
  data: ShipmentPaymentSelection
  onChange: (value: ShipmentPaymentSelection) => void
  onContinue: () => void
  canContinue: boolean
  walletBalance: number | null
  totalAmount: number | null
  quoteLoading: boolean
  quoteError: boolean
  onRefreshQuote: () => void
}) {
  const balanceDisplay = walletBalance != null ? `Balance: ${formatCurrency(walletBalance, 'NGN')}` : 'Balance: —'
  const walletShortfall = walletBalance != null && totalAmount != null ? Math.max(0, totalAmount - walletBalance) : 0
  const walletInsufficient = data.method === 'wallet' && walletBalance != null && totalAmount != null && walletShortfall > 0

  return (
    <FormSection title="Payment Method" subtitle="Select how you want to pay for this shipment.">
      <div className="rounded-2xl border border-[#4043FF]/20 bg-[#4043FF]/5 p-4">
        <p className="text-xs uppercase tracking-[0.08em] text-gray-500">Total amount</p>
        {quoteError ? (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-red-600">Could not get a live shipment quote.</p>
            <button type="button" onClick={onRefreshQuote} className="shrink-0 text-sm font-semibold text-[#4043FF] underline">
              Retry
            </button>
          </div>
        ) : (
          <p className="mt-1 text-2xl font-bold text-[#4043FF]">
            {quoteLoading || totalAmount == null ? 'Calculating…' : formatCurrency(totalAmount, 'NGN')}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label
          className={`flex items-center justify-between border rounded-xl px-4 py-3 transition-colors cursor-pointer ${
            data.method === 'wallet' ? 'border-[#4043FF] bg-[#4043FF]/5' : 'border-gray-200 hover:border-[#4043FF]/40'
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">My Wallet</p>
            <p className="text-xs text-gray-500">{balanceDisplay}</p>
            {walletInsufficient && (
              <p className="mt-1 text-xs font-medium text-[#E56A1A]">
                {formatCurrency(walletShortfall, 'NGN')} more needed
              </p>
            )}
          </div>
          <input
            type="radio"
            name="payment"
            value="wallet"
            checked={data.method === 'wallet'}
            onChange={() => onChange({ method: 'wallet' })}
            className="w-4 h-4 accent-[#4043FF]"
          />
        </label>
        <label
          className={`flex items-center justify-between border rounded-xl px-4 py-3 transition-colors cursor-pointer ${
            data.method === 'card' ? 'border-[#4043FF] bg-[#4043FF]/5' : 'border-gray-200 hover:border-[#4043FF]/40'
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">Pay with Card</p>
            <p className="text-xs text-gray-500">Paystack checkout</p>
          </div>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={data.method === 'card'}
            onChange={() => onChange({ method: 'card' })}
            className="w-4 h-4 accent-[#4043FF]"
          />
        </label>
      </div>

      {walletInsufficient && (
        <Link
          href="/topup"
          className="block text-center text-sm font-semibold text-[#4043FF] hover:underline"
        >
          Top up wallet
        </Link>
      )}

      <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue || quoteLoading || totalAmount == null} />
    </FormSection>
  )
}

function ReviewSummary({
  sender,
  receiver,
  pkg,
  payment,
  onConfirm,
  onEditPayment,
  isSubmitting,
  totalAmount,
  walletBalance,
  displayCurrency,
  ngnPerUsd,
  quoteLoading,
  quoteError,
  onRefreshQuote,
}: {
  sender: ShipmentContact
  receiver: ShipmentContact
  pkg: ShipmentPackage
  payment: ShipmentPaymentSelection
  onConfirm: () => void
  onEditPayment: () => void
  isSubmitting: boolean
  totalAmount: number | null
  walletBalance: number | null
  displayCurrency: 'NGN' | 'USD'
  ngnPerUsd?: number
  quoteLoading: boolean
  quoteError: boolean
  onRefreshQuote: () => void
}) {
  const walletShortfall = walletBalance != null && totalAmount != null ? Math.max(0, totalAmount - walletBalance) : 0
  const walletInsufficient = payment.method === 'wallet' && walletBalance != null && totalAmount != null && walletShortfall > 0
  const convertedTotal = totalAmount == null ? null : convertCurrency(totalAmount, 'NGN', displayCurrency, ngnPerUsd)
  const totalDisplay = totalAmount == null
    ? '—'
    : formatCurrency(convertedTotal ?? totalAmount, convertedTotal == null ? 'NGN' : displayCurrency)

  const isCard = payment.method === 'card'
  const payLabel = totalAmount == null
    ? 'Confirm order'
    : isCard
      ? `Pay ${totalDisplay} with Card`
      : `Pay ${totalDisplay} from Wallet`

  return (
    <FormSection title="Review Summary" subtitle="Confirm the details before completing the order.">
      <div className="space-y-4">
        <SummaryCard title="Sender" items={[
          ['Name', sender.name],
          ['Phone', sender.phone.startsWith('+') ? sender.phone : `${getDialCode(sender.countryCode)} ${sender.phone}`],
          ['Email', sender.email],
          ['Address', sender.address],
        ]} />
        <SummaryCard title="Receiver" items={[
          ['Name', receiver.name],
          ['Phone', receiver.phone.startsWith('+') ? receiver.phone : `${getDialCode(receiver.countryCode)} ${receiver.phone}`],
          ['Email', receiver.email],
          ['Address', receiver.address],
        ]} />
        <SummaryCard title="Package" items={[
          ['Category', pkg.category],
          ['Weight', pkg.weight ? `${pkg.weight} ${pkg.weightUnit.toUpperCase()}` : ''],
          ['Dimensions', `${pkg.length || 0} × ${pkg.width || 0} × ${pkg.height || 0} ${pkg.dimensionUnit.toUpperCase()}`],
        ]} />
        <SummaryCard title="Payment" items={[[
          'Method', isCard ? 'Pay with Card' : 'My Wallet'
        ]]} />

        <div className="rounded-2xl border border-[#4043FF]/20 bg-[#4043FF]/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-gray-500">Total amount</p>
              <p className="mt-1 text-2xl font-bold text-[#4043FF]">{quoteLoading ? 'Calculating…' : totalDisplay}</p>
              <p className="mt-1 text-xs text-gray-500">{totalAmount == null ? 'Live quote required before payment' : `Charged in NGN: ${formatCurrency(totalAmount, 'NGN')}`}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Wallet balance</p>
              <p className="mt-1 font-semibold text-gray-900">{walletBalance == null ? '—' : formatCurrency(walletBalance, 'NGN')}</p>
              {walletInsufficient && (
                <p className="mt-1 text-[#E56A1A]">Need {formatCurrency(walletShortfall, 'NGN')} more</p>
              )}
            </div>
          </div>
          {quoteError && (
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-red-600">
              <span>Could not get a live shipment quote.</span>
              <button type="button" onClick={onRefreshQuote} className="font-semibold underline">Retry</button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Button
          onClick={onConfirm}
          disabled={isSubmitting || quoteLoading || totalAmount == null || walletInsufficient}
          className="w-full h-12 rounded-full bg-[#4043FF] hover:bg-[#3333CC] text-white font-semibold disabled:opacity-60"
        >
          {isSubmitting ? (isCard ? 'Redirecting…' : 'Processing…') : payLabel}
        </Button>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-gray-500">
            {isCard ? 'You will be redirected to Paystack to complete payment.' : 'Your wallet will be debited immediately.'}
          </span>
          <button
            type="button"
            onClick={onEditPayment}
            disabled={isSubmitting}
            className="shrink-0 font-semibold text-[#4043FF] hover:underline disabled:opacity-60"
          >
            Change
          </button>
        </div>

        {walletInsufficient && (
          <Link
            href="/topup"
            className="block text-center text-sm font-semibold text-[#4043FF] hover:underline"
          >
            Top up wallet
          </Link>
        )}
      </div>
    </FormSection>
  )
}

function SummaryCard({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
        {items.map(([label, value], index) => (
          <div key={index} className="text-sm">
            <p className="text-gray-500 font-medium">{label}</p>
            <p className="text-gray-900 font-semibold mt-0.5">{value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Icons                                     */
/* -------------------------------------------------------------------------- */


function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  )
}

function CaretDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function UnitSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: ReadonlyArray<string>
  onChange: (value: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="bg-transparent text-sm font-semibold text-gray-900 focus:outline-none focus:ring-0"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.toUpperCase()}
        </option>
      ))}
    </select>
  )
}

function DimensionInput({
  label,
  placeholder,
  value,
  onChange,
  unit,
  options,
  onUnitChange,
  sanitizeDecimal,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  unit: string
  options: ReadonlyArray<string>
  onUnitChange: (value: string) => void
  sanitizeDecimal: (value: string) => string
}) {
  return (
    <InputRow
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type="text"
      inputMode="decimal"
      pattern="[0-9.]*"
      transform={sanitizeDecimal}
      suffix={
        <UnitSelect
          value={unit}
          options={options}
          onChange={onUnitChange}
        />
      }
      suffixClassName="pr-1 text-gray-900"
    />
  )
}
