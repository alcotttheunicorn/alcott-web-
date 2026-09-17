'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { LocationAutocompleteInput } from '@/components/ui/location-autocomplete-input'
import { PickupMarkerIcon, DeliveryPinIcon, TargetIcon, WeightBoxIcon } from '@/components/shared/location-icons'
import { useProfile } from '@/hooks/use-profile'
import { useCheckPricingAuth } from '@/hooks/use-pricing'
import type { PricingResult } from '@/lib/api/types'

export default function CheckRatesPage() {
  const { profile } = useProfile()
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [weight, setWeight] = useState('')
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)
  const [showRates, setShowRates] = useState(false)

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
        <div className="space-y-3 mb-8">
          {/* Pick up Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pick up Location</label>
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <PickupMarkerIcon />
              </div>
              <div className="flex-1 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <LocationAutocompleteInput
                  value={pickupLocation}
                  onChange={(v) => setPickupLocation(v)}
                  onSelect={(p) => setPickupLocation(p.fullText || `${p.mainText}, ${p.secondaryText}`)}
                  placeholder="Enter pickup location"
                  containerClassName="flex-1"
                  className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                  style={{ fontFamily: "'Urbanist', sans-serif" }}
                />
                <div className="shrink-0">
                  <TargetIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Dotted connecting line */}
          <div className="flex items-center pl-3">
            <div className="w-0.5 h-6 border-l-2 border-dashed border-gray-300" />
          </div>

          {/* Package Destination */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Package Destination</label>
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <DeliveryPinIcon />
              </div>
              <div className="flex-1 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <LocationAutocompleteInput
                  value={destination}
                  onChange={(v) => setDestination(v)}
                  onSelect={(p) => setDestination(p.fullText || `${p.mainText}, ${p.secondaryText}`)}
                  placeholder="Enter destination"
                  containerClassName="flex-1"
                  className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                  style={{ fontFamily: "'Urbanist', sans-serif" }}
                />
                <div className="shrink-0">
                  <TargetIcon />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dimension</h2>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="shrink-0">
              <WeightBoxIcon />
            </div>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Enter package weight"
              value={weight}
              onChange={(e) => {
                const sanitized = sanitizeDecimalInput(e.target.value)
                setWeight(sanitized)
              }}
              className="flex-1 w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            />
            <span className="text-gray-500 font-medium shrink-0" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              kg
            </span>
          </div>
        </div>

        {/* Check button */}
        <button
          onClick={handleCheckRates}
          disabled={isLoading}
          className="w-full bg-[#4043FF] text-white rounded-full py-2.5 px-6 font-bold text-lg hover:bg-[#3333CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-[Urbanist]"
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
            <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Pick up Location
                </p>
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  {pickupLocation || 'Not specified'}
                </p>
              </div>
              <button
                onClick={() => {
                  const temp = pickupLocation
                  setPickupLocation(destination)
                  setDestination(temp)
                }}
                className="shrink-0 p-2 text-[#4043FF] hover:bg-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Package Destination
                </p>
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  {destination || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Pricing Result Card */}
            {(() => {
              const pricingType = (pricingResult.pricing_type ?? '').toLowerCase()
              const isZoneShape = 'export_price' in pricingResult
              const getIcon = () => {
                if (pricingType.includes('express')) {
                  return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                } else if (pricingType.includes('cargo') || isZoneShape) {
                  return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  )
                }
                return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              }

              const formatMoney = (money: { amount: number; currency: string } | undefined) => {
                if (!money) return '—'
                const symbol = money.currency === 'NGN' ? '₦' : `${money.currency} `
                return `${symbol}${money.amount.toLocaleString()}`
              }

              return (
                <div className="space-y-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8E9FF] text-[#4043FF] flex items-center justify-center">
                          {getIcon()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {pricingResult.pricing_type}
                          </p>
                          {!isZoneShape && (pricingResult.distance_km != null || pricingResult.duration_minutes != null) && (
                            <p className="text-xs text-gray-500" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                              {pricingResult.distance_km != null && `${pricingResult.distance_km.toFixed(1)} km`}
                              {pricingResult.distance_km != null && pricingResult.duration_minutes != null && ' · '}
                              {pricingResult.duration_minutes != null && `${Math.round(pricingResult.duration_minutes)} min`}
                            </p>
                          )}
                          {isZoneShape && pricingResult.zone_code != null && (
                            <p className="text-xs text-gray-500" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                              Zone {pricingResult.zone_code}
                            </p>
                          )}
                        </div>
                      </div>

                      {!isZoneShape && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#4043FF]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {formatMoney(pricingResult.price)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Domestic/PREMISE breakdown */}
                    {!isZoneShape && pricingResult.breakdown && (
                      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-y-2 gap-x-4">
                        {pricingResult.breakdown.base_range_cost != null && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Base cost</span>
                            <span className="text-gray-900">{formatMoney({ amount: Number(pricingResult.breakdown.base_range_cost), currency: pricingResult.price?.currency ?? 'NGN' })}</span>
                          </div>
                        )}
                        {pricingResult.breakdown.distance_cost != null && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Distance</span>
                            <span className="text-gray-900">{formatMoney({ amount: Number(pricingResult.breakdown.distance_cost), currency: pricingResult.price?.currency ?? 'NGN' })}</span>
                          </div>
                        )}
                        {pricingResult.breakdown.duration_cost != null && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Duration</span>
                            <span className="text-gray-900">{formatMoney({ amount: Number(pricingResult.breakdown.duration_cost), currency: pricingResult.price?.currency ?? 'NGN' })}</span>
                          </div>
                        )}
                        {pricingResult.breakdown.weight_cost != null && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Weight ({pricingResult.weight}kg)</span>
                            <span className="text-gray-900">{formatMoney({ amount: Number(pricingResult.breakdown.weight_cost), currency: pricingResult.price?.currency ?? 'NGN' })}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cross-border/INTERNATIONAL_ZONE: separate export/import prices, no single total */}
                    {isZoneShape && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600" style={{ fontFamily: "'Urbanist', sans-serif" }}>Export</span>
                          <span className="text-sm font-bold text-[#4043FF]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {formatMoney(pricingResult.export_price)}
                          </span>
                        </div>
                        {pricingResult.export_price?.min_weight != null && (
                          <p className="text-xs text-gray-400">
                            {pricingResult.export_price.min_weight}–{pricingResult.export_price.max_weight}kg range
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                          <span className="text-sm text-gray-600" style={{ fontFamily: "'Urbanist', sans-serif" }}>Import</span>
                          <span className="text-sm font-bold text-[#4043FF]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {formatMoney(pricingResult.import_price)}
                          </span>
                        </div>
                        {pricingResult.import_price?.min_weight != null && (
                          <p className="text-xs text-gray-400">
                            {pricingResult.import_price.min_weight}–{pricingResult.import_price.max_weight}kg range
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </UserAppLayout>
  )
}