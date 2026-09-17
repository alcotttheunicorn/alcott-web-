'use client';

import { useMemo, useState } from 'react'
import type { SVGProps } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { CreateShipmentRequest } from '@/lib/api/shipment-api'
import { useShipmentCategories, useCreateShipment } from '@/hooks/use-shipments'
import { useWalletBalance } from '@/hooks/use-wallet'
import { useAuth } from '@/hooks/use-auth'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { toast } from '@/components/ui/use-toast'
import { Stepper } from '@/components/shipment/Stepper'
import { FormSection } from '@/components/shipment/FormSection'
import { ContinueButton } from '@/components/shipment/ContinueButton'
import { InputRow } from '@/components/shipment/InputRow'
import { TextareaRow } from '@/components/shipment/TextareaRow'
import { useShipmentWizard } from '@/hooks/use-shipment-wizard'
import type {
  ShipmentContact,
  ShipmentOption,
  ShipmentOptions,
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

const shippingOptions: ShipmentOptions = [
  { id: 'regular', label: 'Regular', eta: '3-4 days', price: 12000, rateId: 'shipping-rate-regular', type: 'REGULAR', currency: 'NGN' },
  { id: 'cargo', label: 'Cargo', eta: '3-5 days', price: 18000, rateId: 'shipping-rate-cargo', type: 'CARGO', currency: 'NGN' },
  { id: 'express', label: 'Express', eta: '1-2 days', price: 24000, rateId: 'shipping-rate-express', type: 'EXPRESS', currency: 'NGN' },
]

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

export default function NewShipmentPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { data: categories = [] } = useShipmentCategories()
  const { data: balance } = useWalletBalance()
  const walletBalance = balance ?? null
  const createMutation = useCreateShipment()

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

  const [isSubmitting, setIsSubmitting] = useState(false)

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

    try {
      setIsSubmitting(true)
      const response = await createMutation.mutateAsync(payload)
      toast({
        title: 'Shipment created',
        description: 'Your shipment has been created successfully.',
      })
      if (response?.data && typeof response.data === 'object') {
        window.sessionStorage.setItem('lastCreatedShipment', JSON.stringify(response.data))
      }
      router.push('/shipment/new/success')
    } catch (error) {
      console.error('Failed to create shipment', error)
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        (error as Error).message ||
        'Unable to create shipment. Please try again.'
      toast({ title: 'Shipment creation failed', description: errorMessage })
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
                canContinue={canMoveForward}
                sanitizePhone={sanitizePhoneInput}
              />
            )}
            {currentStep === 'receiver' && (
              <ReceiverForm
                data={receiver}
                onChange={setReceiver}
                onContinue={moveToNext}
                canContinue={canMoveForward}
                sanitizePhone={sanitizePhoneInput}
              />
            )}
            {currentStep === 'package' && (
              <PackageForm
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
              <PaymentForm data={payment} onChange={setPayment} onContinue={moveToNext} canContinue={canMoveForward} walletBalance={walletBalance} />
            )}
            {currentStep === 'finish' && (
              <ReviewSummary
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

/* -------------------------------------------------------------------------- */
/*                               Form Sections                                */
/* -------------------------------------------------------------------------- */

function SenderForm({
  data,
  onChange,
  onContinue,
  canContinue,
  sanitizePhone,
}: {
  data: ShipmentContact
  onChange: (value: ShipmentContact) => void
  onContinue: () => void
  canContinue: boolean
  sanitizePhone: (value: string) => string
}) {
  return (
    <FormSection title="Sender Details" subtitle="Who is sending this package?">
      <InputRow label="Sender Name" placeholder="Sender Name" value={data.name} onChange={(value) => onChange({ ...data, name: value })} />
      <InputRow
        label="Phone Number"
        placeholder="Phone Number"
        value={data.phone}
        onChange={(value) => onChange({ ...data, phone: value })}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={20}
        pattern="[0-9+]*"
        transform={sanitizePhone}
      />
      <InputRow label="Email" placeholder="Email" type="email" value={data.email} onChange={(value) => onChange({ ...data, email: value })} />
      <InputRow label="City / Province" placeholder="City / Province" value={data.city} onChange={(value) => onChange({ ...data, city: value })} />
      <TextareaRow label="Address Details" placeholder="Address Details" value={data.address} onChange={(value) => onChange({ ...data, address: value })} />
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
}: {
  data: ShipmentContact
  onChange: (value: ShipmentContact) => void
  onContinue: () => void
  canContinue: boolean
  sanitizePhone: (value: string) => string
}) {
  return (
    <FormSection title="Receiver Details" subtitle="Who will receive this package?">
      <InputRow label="Receiver Name" placeholder="Receiver Name" value={data.name} onChange={(value) => onChange({ ...data, name: value })} />
      <InputRow
        label="Phone Number"
        placeholder="Phone Number"
        value={data.phone}
        onChange={(value) => onChange({ ...data, phone: value })}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={20}
        pattern="[0-9+]*"
        transform={sanitizePhone}
      />
      <InputRow label="Email" placeholder="Email" type="email" value={data.email} onChange={(value) => onChange({ ...data, email: value })} />
      <InputRow label="City / Province" placeholder="City / Province" value={data.city} onChange={(value) => onChange({ ...data, city: value })} />
      <TextareaRow label="Address Details" placeholder="Address Details" value={data.address} onChange={(value) => onChange({ ...data, address: value })} />
      <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue} />
    </FormSection>
  )
}

function PackageForm({
  data,
  onChange,
  shippingSelection,
  onContinue,
  canContinue,
  weightUnits,
  dimensionUnits,
  sanitizeDecimal,
  categories,
}: {
  data: ShipmentPackage
  onChange: (value: ShipmentPackage) => void
  shippingSelection: ShipmentOption
  onContinue: () => void
  canContinue: boolean
  weightUnits: ShipmentWeightUnit[]
  dimensionUnits: ShipmentDimensionUnit[]
  sanitizeDecimal: (value: string) => string
  categories: string[]
}) {
  const [showOptions, setShowOptions] = useState(false)
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
            {data.category || 'Select category'}
          </span>
          <CaretDownIcon className="w-4 h-4" />
        </button>
        {showCategoryOptions && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
            {categories.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">No categories available</p>
            )}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onChange({ ...data, category: cat })
                  setShowCategoryOptions(false)
                }}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                  data.category === cat ? 'bg-gray-50 font-semibold' : ''
                }`}
              >
                {cat}
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
      <div className="relative">
        <label className="text-sm font-semibold text-gray-700">Select Shipping</label>
        <button
          type="button"
          onClick={() => setShowOptions((prev) => !prev)}
          className="mt-2 w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100"
        >
          <span className="flex items-center gap-1.5 whitespace-normal wrap-break-word text-left">
            <MenuIcon className="w-4 h-4" />
            {shippingSelection ? `${shippingSelection.label} – ₦${shippingSelection.price.toLocaleString()}` : 'Shipping'}
          </span>
          <CaretDownIcon className="w-4 h-4" />
        </button>
        {showOptions && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
            {shippingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange({ ...data, shippingOption: option.id })
                  setShowOptions(false)
                }}
                className={`w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${
                  data.shippingOption === option.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="whitespace-normal wrap-break-word">
                  <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.eta}</p>
                </div>
                <span className="text-sm font-bold text-[#4043FF]">₦{option.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}
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
}: {
  data: ShipmentPaymentSelection
  onChange: (value: ShipmentPaymentSelection) => void
  onContinue: () => void
  canContinue: boolean
  walletBalance: number | null
}) {
  const balanceDisplay = walletBalance != null ? `Balance: ₦${walletBalance.toLocaleString()}` : 'Balance: ₦—'

  return (
    <FormSection title="Payment Method" subtitle="Select how you want to pay for this shipment.">
      <div className="space-y-3">
        <label
          className={`flex items-center justify-between border rounded-xl px-4 py-3 transition-colors ${
            data.method === 'wallet' ? 'border-[#4043FF] bg-[#4043FF]/5' : 'border-gray-200 hover:border-[#4043FF]/40'
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">My Wallet</p>
            <p className="text-xs text-gray-500">{balanceDisplay}</p>
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
          className={`flex items-center justify-between border rounded-xl px-4 py-3 transition-colors ${
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
      <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue} />
    </FormSection>
  )
}

function ReviewSummary({
  sender,
  receiver,
  pkg,
  shippingSelection,
  payment,
  onConfirm,
  isSubmitting,
}: {
  sender: ShipmentContact
  receiver: ShipmentContact
  pkg: ShipmentPackage
  shippingSelection: ShipmentOption
  payment: ShipmentPaymentSelection
  onConfirm: () => void
  isSubmitting: boolean
}) {
  return (
    <FormSection title="Review Summary" subtitle="Confirm the details before completing the order.">
      <div className="space-y-4">
        <SummaryCard title="Sender" items={[
          ['Name', sender.name],
          ['Phone', sender.phone],
          ['Email', sender.email],
          ['Address', sender.address],
        ]} />
        <SummaryCard title="Receiver" items={[
          ['Name', receiver.name],
          ['Phone', receiver.phone],
          ['Email', receiver.email],
          ['Address', receiver.address],
        ]} />
        <SummaryCard title="Package" items={[
          ['Category', pkg.category],
          ['Weight', pkg.weight ? `${pkg.weight} ${pkg.weightUnit.toUpperCase()}` : ''],
          ['Dimensions', `${pkg.length || 0} × ${pkg.width || 0} × ${pkg.height || 0} ${pkg.dimensionUnit.toUpperCase()}`],
          ['Shipping', `${shippingSelection.label} – ₦${shippingSelection.price.toLocaleString()}`],
        ]} />
        <SummaryCard title="Payment" items={[[
          'Method', payment.method === 'wallet' ? 'My Wallet' : 'Pay with Card'
        ]]} />
      </div>

      <div className="pt-4">
        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full h-12 rounded-full bg-[#4043FF] hover:bg-[#3333CC] text-white font-semibold disabled:opacity-60"
        >
          {isSubmitting ? 'Confirming…' : 'Confirm Order'}
        </Button>
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
