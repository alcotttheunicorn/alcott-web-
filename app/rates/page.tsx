'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { LocationAutocompleteInput } from '@/components/ui/location-autocomplete-input'
import { PickupMarkerIcon, DeliveryPinIcon, TargetIcon, WeightBoxIcon } from '@/components/shared/location-icons'
import { useProfile } from '@/hooks/use-profile'
import { useCheckPricingAuth } from '@/hooks/use-pricing'
import { useExchangeRate } from '@/hooks/use-pricing'
import { useCurrency } from '@/components/providers/currency-provider'
import { convertCurrency, formatCurrency } from '@/lib/currency'
import type { PricingResult } from '@/lib/api/types'

export default function CheckRatesPage() {
  const { profile } = useProfile()
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [weight, setWeight] = useState('')
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)
  const [showRates, setShowRates] = useState(false)
  const { currency: displayCurrency } = useCurrency()
  const { data: exchangeRate } = useExchangeRate()

  const sanitizeDecimalInput = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '')
    const [integer, fraction] = cleaned.split('.')
    if (fraction !== undefined) {
      return `${integer}${fraction ? `.${fraction.replace(/\./g, '')}` : ''}`
    }
    return integer
  }

  const checkRatesMutation = useCheckPricingAuth()
  const isLoading = checkRatesMutation.isPending

  const handleCheckRates = () => {
    if (!pickupLocation.trim() || !destination.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in both pickup location and destination.',
      })
      return
    }

    const weightValue = parseFloat(weight) || 0
    if (weightValue <= 0) {
      toast({
        title: 'Invalid weight',
        description: 'Please enter a valid weight.',
      })
      return
    }

    const weightInKg = weightValue

    checkRatesMutation.mutate(
      {
        sender_address: pickupLocation.trim(),
        receiver_address: destination.trim(),
        weight: weightInKg,
        sender_email: profile?.email,
        sender_phone_number: profile?.phone_number,
      },
      {
        onSuccess: (res) => {
          // Confirmed via console logs: PREMISE (domestic) responses nest the price
          // under `price.amount`, but INTERNATIONAL_ZONE (cross-border) responses
          // have no `price` field at all — instead `export_price`/`import_price`.
          // Accept either rather than assuming one shape covers every pricing_type.
          const hasPremiseShape = typeof res.data?.price?.amount === 'number'
          const hasZoneShape = typeof res.data?.export_price?.amount === 'number' || typeof res.data?.import_price?.amount === 'number'

          if (!hasPremiseShape && !hasZoneShape) {
            console.error('Unexpected /pricing/check/authenticated response shape:', res)
            toast({
              title: 'Unexpected pricing response',
              description: "The server didn't return pricing in the expected format. Check the console for details.",
            })
            return
          }

          setPricingResult(res.data)
          setShowRates(true)
        },
        onError: (err: any) => {
          console.error('checkPricingAuth failed:', err?.response?.data ?? err)
          toast({
            title: 'Could not fetch rates',
            description: err?.response?.data?.message || 'Please try again later.',
          })
        },
      },
    )
  }

  return (
    <UserAppLayout activeNav="home" contentBgClass="bg-white" searchOnNavigateToSearchPage>
      <div className="mx-auto w-full max-w-8xl px-4 py-4 lg:px-6 lg:py-6">
        {/* Back button and title */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Check Rates</h1>
        </div>

        {/* Location inputs with connecting line */}
        <div className="mb-8 relative">
          <div className="space-y-4">
            {/* Pick up Location */}
            <div className="flex items-center gap-4 bg-[#F8F9FA] rounded-2xl p-4">
              <div className="shrink-0">
                <PickupMarkerIcon />
              </div>
              <div className="flex-1 flex items-center gap-3">
                <LocationAutocompleteInput
                  value={pickupLocation}
                  onChange={(v) => setPickupLocation(v)}
                  onSelect={(p) => setPickupLocation(p.fullText || `${p.mainText}, ${p.secondaryText}`)}
                  placeholder="Pick up Location"
                  containerClassName="flex-1"
                  className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-[15px]"
                  style={{ fontFamily: "'Urbanist', sans-serif" }}
                />
                <div className="shrink-0 cursor-pointer">
                  <TargetIcon />
                </div>
              </div>
            </div>

            {/* Dashed connecting line */}
            <div className="absolute left-9 top-[54px] w-0 h-4 border-l-2 border-dashed border-gray-300" />

            {/* Package Destination */}
            <div className="flex items-center gap-4 bg-[#F8F9FA] rounded-2xl p-4">
              <div className="shrink-0">
                <DeliveryPinIcon />
              </div>
              <div className="flex-1 flex items-center gap-3">
                <LocationAutocompleteInput
                  value={destination}
                  onChange={(v) => setDestination(v)}
                  onSelect={(p) => setDestination(p.fullText || `${p.mainText}, ${p.secondaryText}`)}
                  placeholder="Package Destination"
                  containerClassName="flex-1"
                  className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-[15px]"
                  style={{ fontFamily: "'Urbanist', sans-serif" }}
                />
                <div className="shrink-0 cursor-pointer">
                  <TargetIcon />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension section */}
        <div className="mb-8">
          <h2 className="text-[15px] font-bold text-gray-900 mb-3" style={{ fontFamily: "'Urbanist', sans-serif" }}>Dimension</h2>
          <div className="flex items-center gap-3 p-4 bg-[#F8F9FA] rounded-2xl">
            <div className="shrink-0">
              <WeightBoxIcon />
            </div>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={weight}
              onChange={(e) => {
                const sanitized = sanitizeDecimalInput(e.target.value)
                setWeight(sanitized)
              }}
              className="flex-1 w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-[15px]"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            />
            <span className="text-gray-500 font-medium shrink-0 text-[15px]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              kg
            </span>
          </div>
        </div>

        {/* Check button */}
        <button
          onClick={handleCheckRates}
          disabled={isLoading}
          className="w-full bg-[#4043FF] text-white rounded-full py-4 px-6 font-bold text-[16px] hover:bg-[#3333CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-[Urbanist]"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          {isLoading ? 'Checking...' : 'Check'}
        </button>

        {/* Rates Display */}
        {showRates && pricingResult && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              Rates
            </h2>

            {/* Location Summary */}
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex-1 text-center">
                <p className="text-[15px] font-bold text-gray-900 mb-1" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  {pickupLocation || 'Not specified'}
                </p>
                <p className="text-[11px] text-gray-400 font-medium" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Pick-up Location
                </p>
              </div>
              
              <div className="shrink-0 px-2 text-[#4043FF]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L3 14L7 18M21 14H3M17 14L21 10L17 6M3 10H21" stroke="#4043FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="flex-1 text-center">
                <p className="text-[15px] font-bold text-gray-900 mb-1" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  {destination || 'Not specified'}
                </p>
                <p className="text-[11px] text-gray-400 font-medium" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Package Destination
                </p>
              </div>
            </div>

            {/* Pricing Result Cards */}
            {(() => {
              const isZoneShape = 'export_price' in pricingResult
              const basePrice = isZoneShape
                ? (pricingResult.export_price?.amount || 0) + (pricingResult.import_price?.amount || 0)
                : (pricingResult.price?.amount || 0)
              const sourceCurrency = isZoneShape
                ? (pricingResult.export_price?.currency || 'NGN')
                : (pricingResult.price?.currency || 'NGN')
              const nativeCurrency = sourceCurrency === 'USD' ? 'USD' : 'NGN'
              const convertedBasePrice = convertCurrency(basePrice, nativeCurrency, displayCurrency, exchangeRate?.ngn_per_usd)
              const currency = convertedBasePrice == null ? nativeCurrency : displayCurrency
              const displayBasePrice = convertedBasePrice ?? basePrice

              const formatMoney = (amount: number) => {
                if (!amount) return '—'
                return formatCurrency(amount, currency)
              }

              return (
                <div className="max-w-4xl rounded-xl border border-gray-100 bg-white px-5 py-6 text-right shadow-sm">
                  <p className="text-2xl font-bold text-[#4043FF]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                    {formatMoney(displayBasePrice)}
                  </p>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </UserAppLayout>
  )
}