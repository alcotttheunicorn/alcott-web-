'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LocationAutocompleteInput } from '@/components/ui/location-autocomplete-input'
import { PickupMarkerIcon, DeliveryPinIcon } from '@/components/shared/location-icons'
import type { PricingResult } from '@/lib/api/types'
import type { CurrencyCode } from '@/components/providers/currency-provider'
import { convertCurrency, formatCurrency } from '@/lib/currency'

interface ShipmentBookingHeroProps {
  pickupAddress: string
  onPickupChange: (value: string) => void
  deliveryAddress: string
  onDeliveryChange: (value: string) => void
  weight: string
  onWeightChange: (value: string) => void
  onCheckRates: (phoneNumber: string, email: string) => void
  isCheckingRates: boolean
  pricingResult: PricingResult | null
  displayCurrency: CurrencyCode
  ngnPerUsd?: number
  onClearResult?: () => void
}

const stats = [
  { value: '18,000+', label: 'Parcels delivered' },
  { value: '8+', label: 'Years in business' },
  { value: '220+', label: 'Global destinations' },
]

const trustItems = ['Fully insured', 'Real-time tracking', '220+ global destinations']

export function ShipmentBookingHero({
  pickupAddress,
  onPickupChange,
  deliveryAddress,
  onDeliveryChange,
  weight,
  onWeightChange,
  onCheckRates,
  isCheckingRates,
  pricingResult,
  displayCurrency,
  ngnPerUsd,
  onClearResult,
}: ShipmentBookingHeroProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')

  const handleTrackingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = trackingNumber.trim()
    if (!query) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleRateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onCheckRates(phoneNumber, email)
  }

  const handleRequestDelivery = () => {
    if (isAuthenticated) {
      router.push('/shipment/new')
      return
    }
    router.push('/lets-get-you-in')
  }

  const formatRate = (amount: number, source: string | undefined) => {
    const sourceCurrency: CurrencyCode = source === 'USD' ? 'USD' : 'NGN'
    const converted = convertCurrency(amount, sourceCurrency, displayCurrency, ngnPerUsd)
    return converted == null
      ? formatCurrency(amount, sourceCurrency)
      : formatCurrency(converted, displayCurrency)
  }

  return (
    <section className="bg-[#f3f9fd]">
      <div className="max-w-9xl mx-auto px-4 lg:px-12 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Left: copy, tracking, request delivery, stats */}
        <div className="flex flex-col items-start gap-6 lg:gap-8 w-full lg:w-[620px] shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4043ff] rounded-[100px]">
            <span className="text-white text-[13px] font-semibold tracking-[0] ">
              GLOBAL LOGISTICS. LOCAL EXPERTISE.
            </span>
          </div>

          <h1 className="text-[36px] sm:text-[48px] lg:text-[64px] font-extrabold tracking-[-0.64px] leading-[1.1] ">
            <span className="text-[#12141d]">Ship </span>
            <span className="text-[#4043ff]">
              anything.
              <br />
              Anywhere
            </span>
            <span className="text-[#12141d]">
              .
              <br />
              We handle the rest.
            </span>
          </h1>

          <p className="text-gray-500 text-[15px] sm:text-[17px] leading-7 ">
            End-to-end logistics for individuals and businesses — from local
            deliveries and international shipping to air &amp; sea freight,
            customs clearance and last-mile delivery.
          </p>

          {/* Tracking form */}
          <form
            onSubmit={handleTrackingSubmit}
            className="flex w-full max-w-[513px] h-16 items-center bg-white rounded-[100px] shadow-[0px_8px_32px_#4043ff20]
          ">
            <label className="flex flex-1 h-16 items-center gap-3 pl-6">
              <svg
                className="w-5 h-5 shrink-0 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                aria-label="Tracking number"
                className="w-full min-w-0 bg-transparent outline-none text-gray-700 text-base placeholder:text-gray-400" 
                placeholder="Enter tracking number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-16 items-center justify-center gap-2 px-7 bg-[#4043ff] rounded-[100px] hover:bg-[#3333cc] transition-colors
            ">
              <span className="text-white text-base font-bold ">
                Track
              </span>
            </button>
          </form>

          {/* Request a Delivery */}
          <button
            type="button"
            onClick={handleRequestDelivery}
            className="flex w-full max-w-[527px] items-center justify-center px-9 py-[18px] bg-[#4043ff] rounded-[100px] shadow-[4px_8px_24px_#4043ff40] hover:bg-[#3333cc] transition-colors
          ">
            <span className="text-white text-[17px] font-bold ">
              Request a Delivery
            </span>
          </button>

          {/* Stats */}
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            {stats.map((stat, index) => (
              <div key={stat.label} className="contents">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[#12141d] text-[22px] sm:text-[26px] font-extrabold ">
                    {stat.value}
                  </span>
                  <span className="text-gray-500 text-[13px] ">
                    {stat.label}
                  </span>
                </div>
                {index < stats.length - 1 && (
                  <span className="w-px h-10 bg-zinc-200" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rate Calculator card */}
        <div className="relative w-full max-w-[720px] flex items-center justify-center">
          <div className="hidden lg:block absolute top-0 left-0 w-[560px] h-[560px] bg-[#eef0ff] rounded-full" />
          <div className="hidden lg:block absolute top-0 left-0 w-[420px] h-[420px] bg-[#e0e2ff] rounded-full opacity-60" />

          <form
            onSubmit={handleRateSubmit}
            className="relative w-full max-w-[480px] bg-white rounded-3xl overflow-hidden shadow-[0px_20px_60px_#4043ff1a,0px_4px_16px_#00000008]
          ">
            <header className="flex items-center gap-3 pt-7 pb-6 px-7 bg-[#4043ff]">
              <div className="flex w-10 h-10 items-center justify-center bg-[#ffffff22] rounded-xl">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="text-white text-xl font-extrabold ">
                  Rate Calculator
                </h2>
                <p className="text-[#ffffffb2] text-[10px] ">
                  Suitable for small sized parcels. For large shipments, send us an email.
                </p>
              </div>
            </header>

            <div className="flex flex-col gap-5 pt-6 pb-7 px-7">
              <div className="flex flex-col gap-3.5">
                {/* From */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-gray-700 text-xs font-semibold ">
                    From
                  </span>
                  <span className="flex h-12 items-center gap-2.5 px-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                      <PickupMarkerIcon />
                    </span>
                    <LocationAutocompleteInput
                      value={pickupAddress}
                      onChange={onPickupChange}
                      placeholder="Pick up address"
                      containerClassName="flex-1"
                      className="w-full min-w-0 bg-transparent outline-none text-gray-700 text-sm placeholder:text-gray-400" 
                    />
                  </span>
                </label>

                {/* To */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-gray-700 text-xs font-semibold ">
                    To
                  </span>
                  <span className="flex h-12 items-center gap-2.5 px-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                      <DeliveryPinIcon />
                    </span>
                    <LocationAutocompleteInput
                      value={deliveryAddress}
                      onChange={onDeliveryChange}
                      placeholder="Destination address"
                      containerClassName="flex-1"
                      className="w-full min-w-0 bg-transparent outline-none text-gray-700 text-sm placeholder:text-gray-400" 
                    />
                  </span>
                </label>

                {/* Weight */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-gray-700 text-xs font-semibold ">
                    Weight (kg)
                  </span>
                  <span className="flex h-12 items-center gap-2.5 px-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <svg className="w-4 h-4 shrink-0 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    </svg>
                    <input
                      aria-label="Weight (kg)"
                      type="text"
                      inputMode="decimal"
                      className="min-w-0 w-full bg-transparent outline-none text-gray-700 text-sm placeholder:text-gray-400" 
                      placeholder="e.g. 5"
                      value={weight}
                      onChange={(e) => onWeightChange(e.target.value)}
                    />
                  </span>
                </label>

                {/* Contact details */}
                <div className="flex flex-col gap-3.5">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-gray-700 text-xs font-semibold ">
                      Phone number
                    </span>
                    <span className="flex h-12 items-center px-3.5 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="tel"
                        aria-label="Phone number"
                        className="min-w-0 w-full bg-transparent outline-none text-gray-700 text-sm placeholder:text-gray-400" 
                        placeholder="+234 906 000 7571"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </span>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-gray-700 text-xs font-semibold ">
                      Email
                    </span>
                    <span className="flex h-12 items-center px-3.5 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="email"
                        aria-label="Email"
                        className="min-w-0 w-full bg-transparent outline-none text-gray-700 text-sm placeholder:text-gray-400" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isCheckingRates}
                className="flex h-[52px] items-center justify-center gap-2.5 w-full bg-[#4043ff] rounded-[14px] shadow-[0px_8px_20px_#4043ff40] hover:bg-[#3333cc] disabled:opacity-60 disabled:cursor-not-allowed transition-colors
              ">
                <span className="text-white text-base font-bold ">
                  {isCheckingRates ? 'Checking…' : 'Calculate Rate'}
                </span>
              </button>

              {/* Live pricing result */}
              {pricingResult && (
                <div className="flex items-center justify-between p-[11px] bg-[#f3f7ff] rounded-[10px] overflow-hidden">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[#4043ff] text-[8px] font-semibold [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]">
                      Estimated Rate
                    </span>
                    <span className="text-[#12141d] text-[13px] font-extrabold ">
                      {'price' in pricingResult && pricingResult.price
                        ? formatRate(pricingResult.price.amount, pricingResult.price.currency)
                        : pricingResult.export_price
                          ? formatRate(pricingResult.export_price.amount, pricingResult.export_price.currency)
                          : '—'}
                    </span>
                    {pricingResult.import_price && (
                      <span className="text-[#12141d] text-[11px] font-semibold ">
                        Import: {formatRate(pricingResult.import_price.amount, pricingResult.import_price.currency)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <button
                      type="button"
                      onClick={() => onClearResult?.()}
                      className="text-[#5b6070] text-[8px] [font-family:Plus_Jakarta_Sans',system-ui,sans-serif] hover:text-[#4043ff]"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestDelivery}
                      className="text-[#21a366] text-[9px] font-bold [font-family:Plus_Jakarta_Sans',system-ui,sans-serif] hover:underline"
                    >
                      Request Delivery →
                    </button>
                  </div>
                </div>
              )}

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {trustItems.map((item, index) => (
                  <div key={item} className="contents">
                    <span className="text-gray-500 text-[11px] font-medium ">
                      {item}
                    </span>
                    {index < trustItems.length - 1 && (
                      <span className="w-px h-3.5 bg-zinc-200" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}