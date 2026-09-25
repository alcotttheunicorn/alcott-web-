'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LocationAutocompleteInput } from '@/components/ui/location-autocomplete-input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PickupMarkerIcon, DeliveryPinIcon, TargetIcon, WeightBoxIcon } from '@/components/shared/location-icons'
import type { PricingResult } from '@/lib/api/types'

interface CheckRatesSectionProps {
    pickupAddress: string
    onPickupChange: (value: string) => void
    deliveryAddress: string
    onDeliveryChange: (value: string) => void
    weight: string
    onWeightChange: (value: string) => void
    onCheckRates: (phoneNumber: string, email: string) => void
    isCheckingRates: boolean
    pricingResult: PricingResult | null
    onClearResult?: () => void
}

export function CheckRatesSection({
    pickupAddress,
    onPickupChange,
    deliveryAddress,
    onDeliveryChange,
    weight,
    onWeightChange,
    onCheckRates,
    isCheckingRates,
    pricingResult,
    onClearResult,
}: CheckRatesSectionProps) {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const router = useRouter()

    return (
        <section className="bg-white py-12 lg:py-16">
            <div className="max-w-8xl mx-auto px-4 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                    <div className="flex-1 flex flex-col items-start">
                        <div className="relative mb-6 lg:mb-8">
                            <img src="/check-rates.png" alt="Product packaging" className="w-full max-w-sm lg:max-w-lg rounded-2xl mx-auto" />
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md mx-auto lg:mx-0">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Check Rates</h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="shrink-0">
                                    <PickupMarkerIcon />
                                </div>
                                <div className="flex-1 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <LocationAutocompleteInput
                                        value={pickupAddress}
                                        onChange={onPickupChange}
                                        placeholder="Pick up address"
                                        containerClassName="flex-1"
                                        className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                    />
                                    <div className="shrink-0">
                                        <TargetIcon />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center pl-3">
                                <div className="w-0.5 h-6 border-l-2 border-dashed border-gray-300" />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="shrink-0">
                                    <DeliveryPinIcon />
                                </div>
                                <div className="flex-1 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <LocationAutocompleteInput
                                        value={deliveryAddress}
                                        onChange={onDeliveryChange}
                                        placeholder="Delivery address"
                                        containerClassName="flex-1"
                                        className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                    />
                                    <div className="shrink-0">
                                        <TargetIcon />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Weight</h3>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0">
                                        <WeightBoxIcon />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="2.2"
                                        className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                        value={weight}
                                        onChange={(e) => onWeightChange(e.target.value)}
                                    />
                                    <span className="text-gray-500 font-medium" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>kg</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Phone number</h3>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.5241 13.8065C11.6962 13.8855 11.8901 13.9036 12.0738 13.8577C12.2575 13.8118 12.4202 13.7047 12.5349 13.554L12.8307 13.1665C12.986 12.9595 13.1873 12.7915 13.4187 12.6758C13.6501 12.5601 13.9053 12.4998 14.1641 12.4998H16.6641C17.1061 12.4998 17.53 12.6754 17.8426 12.988C18.1551 13.3006 18.3307 13.7245 18.3307 14.1665V16.6665C18.3307 17.1085 18.1551 17.5325 17.8426 17.845C17.53 18.1576 17.1061 18.3332 16.6641 18.3332C12.6858 18.3332 8.87051 16.7528 6.05746 13.9398C3.24442 11.1267 1.66406 7.31142 1.66406 3.33317C1.66406 2.89114 1.83966 2.46722 2.15222 2.15466C2.46478 1.8421 2.8887 1.6665 3.33073 1.6665H5.83073C6.27276 1.6665 6.69668 1.8421 7.00924 2.15466C7.3218 2.46722 7.4974 2.89114 7.4974 3.33317V5.83317C7.4974 6.09191 7.43715 6.3471 7.32144 6.57853C7.20573 6.80995 7.03772 7.01126 6.83073 7.1665L6.44073 7.459C6.28774 7.57582 6.17991 7.74199 6.13555 7.9293C6.0912 8.1166 6.11305 8.31348 6.1974 8.4865C7.3363 10.7997 9.20942 12.6705 11.5241 13.8065Z" fill="#212121" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>

                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="+234 906 000 7571"
                                        className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                        value={phoneNumber}
                                        onChange={(event) => setPhoneNumber(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Email</h3>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.3307 5.8335L10.8382 10.606C10.584 10.7537 10.2952 10.8315 10.0011 10.8315C9.70712 10.8315 9.41832 10.7537 9.16406 10.606L1.66406 5.8335" fill="#212121"/>
                                            <path d="M16.6641 3.3335H3.33073C2.41025 3.3335 1.66406 4.07969 1.66406 5.00016V15.0002C1.66406 15.9206 2.41025 16.6668 3.33073 16.6668H16.6641C17.5845 16.6668 18.3307 15.9206 18.3307 15.0002V5.00016C18.3307 4.07969 17.5845 3.3335 16.6641 3.3335Z" fill="#212121"/>
                                            <path d="M18.3307 5.8335L10.8382 10.606C10.584 10.7537 10.2952 10.8315 10.0011 10.8315C9.70712 10.8315 9.41832 10.7537 9.16406 10.606L1.66406 5.8335M3.33073 3.3335H16.6641C17.5845 3.3335 18.3307 4.07969 18.3307 5.00016V15.0002C18.3307 15.9206 17.5845 16.6668 16.6641 16.6668H3.33073C2.41025 16.6668 1.66406 15.9206 1.66406 15.0002V5.00016C1.66406 4.07969 2.41025 3.3335 3.33073 3.3335Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="info@alcott.com.ng"
                                        className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-8 py-3 text-base font-semibold rounded-full w-full h-12 mt-6"
                                onClick={() => onCheckRates(phoneNumber, email)}
                                disabled={isCheckingRates}
                            >
                                {isCheckingRates ? 'Checking...' : 'Check'}
                            </Button>

                            {pricingResult && (
                                <Dialog open={!!pricingResult} onOpenChange={(open) => { if (!open) onClearResult?.() }}>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                Rate Check Result
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="pt-2 pb-4 space-y-4">
                                            {/* Route summary */}
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <PickupMarkerIcon />
                                                        <div className="w-px flex-1 min-h-[2.5rem] bg-[#4043FF]/30" />
                                                        <DeliveryPinIcon />
                                                    </div>
                                                    <div className="flex-1 space-y-6">
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-500" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>From</p>
                                                            <p className="text-sm font-bold text-gray-900 mt-0.5" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                                {pickupAddress || '—'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-500" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>To</p>
                                                            <p className="text-sm font-bold text-gray-900 mt-0.5" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                                {deliveryAddress || '—'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Weight */}
                                            {weight && (
                                                <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                                                    <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Weight</span>
                                                    <span className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                        {weight} kg
                                                    </span>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="rounded-xl bg-[#F0F0FF] px-4 py-4 text-center">
                                                {'price' in pricingResult && pricingResult.price ? (
                                                    <div>
                                                        {/* <p className="text-xs font-semibold text-[#4043FF] mb-1" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>{pricingResult.pricing_type}</p> */}
                                                        <p className="text-2xl font-bold text-[#4043FF]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                            {pricingResult.price.currency === 'NGN' ? '₦' : `${pricingResult.price.currency} `}
                                                            {pricingResult.price.amount.toLocaleString()}
                                                        </p>
                                                    </div>
                                                ) : pricingResult.export_price ? (
                                                    <div className="space-y-1">
                                                        {/* <p className="text-xs font-semibold text-[#4043FF] mb-1" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>{pricingResult.pricing_type}</p> */}
                                                        <div className="flex items-center justify-center gap-4">
                                                            <div>
                                                                <p className="text-[10px] font-semibold text-gray-500" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Export</p>
                                                                <p className="text-lg font-bold text-[#4043FF]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                                    {pricingResult.export_price.currency === 'NGN' ? '₦' : `${pricingResult.export_price.currency} `}
                                                                    {pricingResult.export_price.amount.toLocaleString()}
                                                                </p>
                                                            </div>
                                                            {pricingResult.import_price && (
                                                                <div>
                                                                    <p className="text-[10px] font-semibold text-gray-500" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Import</p>
                                                                    <p className="text-lg font-bold text-[#4043FF]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                                        {pricingResult.import_price.currency === 'NGN' ? '₦' : `${pricingResult.import_price.currency} `}
                                                                        {pricingResult.import_price.amount.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>

                                            {/* Actions */}
                                            <div className="space-y-2.5">
                                                <Button
                                                    className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-8 py-3 text-base font-semibold rounded-full w-full"
                                                    onClick={() => router.push('/shipment/new')}
                                                >
                                                    Request Delivery
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="border border-[#4043FF] text-[#4043FF] hover:bg-[#F0F0FF] px-8 py-3 text-base font-semibold rounded-full w-full"
                                                    onClick={() => onClearResult?.()}
                                                >
                                                    New Rate Check
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}