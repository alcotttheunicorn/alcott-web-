'use client'

import { Button } from '@/components/ui/button'
import { LocationAutocompleteInput } from '@/components/ui/location-autocomplete-input'
import type { PricingResult } from '@/lib/api/types'

interface CheckRatesSectionProps {
    pickupAddress: string
    onPickupChange: (value: string) => void
    deliveryAddress: string
    onDeliveryChange: (value: string) => void
    weight: string
    onWeightChange: (value: string) => void
    onCheckRates: () => void
    isCheckingRates: boolean
    pricingResult: PricingResult | null
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
}: CheckRatesSectionProps) {
    return (
        <section className="bg-white py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative mb-6 lg:mb-8">
                            <img src="/check-rates.png" alt="Product packaging" className="w-full max-w-sm lg:max-w-lg rounded-2xl mx-auto" />
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md mx-auto lg:mx-0">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Check Rates</h2>

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 bg-[#4043FF] rounded-full flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </div>
                                    <LocationAutocompleteInput
                                        value={pickupAddress}
                                        onChange={onPickupChange}
                                        placeholder="Pick up address"
                                        containerClassName="flex-1"
                                        className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                    />
                                    <div className="w-6 h-6 bg-[#4043FF] rounded-full flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 bg-[#4043FF] rounded-full flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </div>
                                    <LocationAutocompleteInput
                                        value={deliveryAddress}
                                        onChange={onDeliveryChange}
                                        placeholder="Delivery address"
                                        containerClassName="flex-1"
                                        className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                    />
                                    <div className="w-6 h-6 bg-[#4043FF] rounded-full flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Weight</h3>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 bg-[#4043FF] rounded flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v6l5.25 3.15.75-1.23-4.5-2.67V8z"/>
                                        </svg>
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
                                    <div className="w-6 h-6 bg-[#4043FF] rounded flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="+234 906 000 7571"
                                        className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Email</h3>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 bg-[#4043FF] rounded flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="info@alcott.com.ng"
                                        className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                    />
                                </div>
                            </div>

                            <Button
                                className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-8 py-3 text-base font-semibold rounded-full w-full h-12 mt-6"
                                onClick={onCheckRates}
                                disabled={isCheckingRates}
                            >
                                {isCheckingRates ? 'Checking...' : 'Check'}
                            </Button>

                            {pricingResult && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                        {pricingResult.pricing_type}
                                    </p>
                                    {'price' in pricingResult && pricingResult.price ? (
                                        <p className="text-xl font-bold text-[#4043FF]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                            {pricingResult.price.currency === 'NGN' ? '₦' : `${pricingResult.price.currency} `}
                                            {pricingResult.price.amount.toLocaleString()}
                                        </p>
                                    ) : pricingResult.export_price ? (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-700" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                Export: <span className="font-bold text-[#4043FF]">
                                                    {pricingResult.export_price.currency === 'NGN' ? '₦' : `${pricingResult.export_price.currency} `}
                                                    {pricingResult.export_price.amount.toLocaleString()}
                                                </span>
                                            </p>
                                            {pricingResult.import_price && (
                                                <p className="text-sm text-gray-700" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                    Import: <span className="font-bold text-[#4043FF]">
                                                        {pricingResult.import_price.currency === 'NGN' ? '₦' : `${pricingResult.import_price.currency} `}
                                                        {pricingResult.import_price.amount.toLocaleString()}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}