'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LocationAutocompleteInput } from '@/components/ui/location-autocomplete-input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
                            <div className="relative">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.9531 33C26.2374 33 32.9531 26.2843 32.9531 18C32.9531 9.71573 26.2374 3 17.9531 3C9.66885 3 2.95312 9.71573 2.95312 18C2.95312 26.2843 9.66885 33 17.9531 33Z" stroke="#4043FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M18.0013 24.3453C21.5055 24.3453 24.3462 21.5045 24.3462 18.0003C24.3462 14.496 21.5055 11.6553 18.0013 11.6553C14.497 11.6553 11.6562 14.496 11.6562 18.0003C11.6562 21.5045 14.497 24.3453 18.0013 24.3453Z" fill="#4043FF" stroke="#4043FF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <LocationAutocompleteInput
                                        value={pickupAddress}
                                        onChange={onPickupChange}
                                        placeholder="Pick up address"
                                        country="NG"
                                        containerClassName="flex-1"
                                        className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                    />
                                    <div className="w-6 h-6  rounded-full flex items-center justify-center shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.0026 6.66659C8.16094 6.66659 6.66927 8.15825 6.66927 9.99992C6.66927 11.8416 8.16094 13.3333 10.0026 13.3333C11.8443 13.3333 13.3359 11.8416 13.3359 9.99992C13.3359 8.15825 11.8443 6.66659 10.0026 6.66659ZM17.4526 9.16659C17.2638 7.47669 16.5061 5.9012 15.3037 4.69883C14.1013 3.49646 12.5258 2.73868 10.8359 2.54992V1.66659C10.8359 1.20825 10.4609 0.833252 10.0026 0.833252C9.54427 0.833252 9.16927 1.20825 9.16927 1.66659V2.54992C7.47937 2.73868 5.90389 3.49646 4.70152 4.69883C3.49915 5.9012 2.74136 7.47669 2.5526 9.16659H1.66927C1.21094 9.16659 0.835938 9.54159 0.835938 9.99992C0.835938 10.4583 1.21094 10.8333 1.66927 10.8333H2.5526C2.74136 12.5232 3.49915 14.0986 4.70152 15.301C5.90389 16.5034 7.47937 17.2612 9.16927 17.4499V18.3333C9.16927 18.7916 9.54427 19.1666 10.0026 19.1666C10.4609 19.1666 10.8359 18.7916 10.8359 18.3333V17.4499C12.5258 17.2612 14.1013 16.5034 15.3037 15.301C16.5061 14.0986 17.2638 12.5232 17.4526 10.8333H18.3359C18.7943 10.8333 19.1693 10.4583 19.1693 9.99992C19.1693 9.54159 18.7943 9.16659 18.3359 9.16659H17.4526V9.16659ZM10.0026 15.8333C6.7776 15.8333 4.16927 13.2249 4.16927 9.99992C4.16927 6.77492 6.7776 4.16659 10.0026 4.16659C13.2276 4.16659 15.8359 6.77492 15.8359 9.99992C15.8359 13.2249 13.2276 15.8333 10.0026 15.8333Z" fill="#4043FF"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                                        <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 12.4766C0 5.57684 5.76582 0 12.7402 0C19.7342 0 25.5 5.57684 25.5 12.4766C25.5 15.9535 24.2355 19.1814 22.1542 21.9174C19.8582 24.9353 17.0282 27.5647 13.8428 29.6286C13.1138 30.1056 12.4558 30.1416 11.6557 29.6286C8.4521 27.5647 5.62213 24.9353 3.34575 21.9174C1.26298 19.1814 0 15.9535 0 12.4766ZM8.54134 12.8651C8.54134 15.1766 10.4275 16.9945 12.7402 16.9945C15.0544 16.9945 16.9587 15.1766 16.9587 12.8651C16.9587 10.5717 15.0544 8.66525 12.7402 8.66525C10.4275 8.66525 8.54134 10.5717 8.54134 12.8651Z" fill="#4043FF"/>
                                        </svg>

                                    </div>
                                    <LocationAutocompleteInput
                                        value={deliveryAddress}
                                        onChange={onDeliveryChange}
                                        placeholder="Delivery address"
                                        country="NG"
                                        containerClassName="flex-1"
                                        className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium"
                                        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                                    />
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.0026 6.66659C8.16094 6.66659 6.66927 8.15825 6.66927 9.99992C6.66927 11.8416 8.16094 13.3333 10.0026 13.3333C11.8443 13.3333 13.3359 11.8416 13.3359 9.99992C13.3359 8.15825 11.8443 6.66659 10.0026 6.66659ZM17.4526 9.16659C17.2638 7.47669 16.5061 5.9012 15.3037 4.69883C14.1013 3.49646 12.5258 2.73868 10.8359 2.54992V1.66659C10.8359 1.20825 10.4609 0.833252 10.0026 0.833252C9.54427 0.833252 9.16927 1.20825 9.16927 1.66659V2.54992C7.47937 2.73868 5.90389 3.49646 4.70152 4.69883C3.49915 5.9012 2.74136 7.47669 2.5526 9.16659H1.66927C1.21094 9.16659 0.835938 9.54159 0.835938 9.99992C0.835938 10.4583 1.21094 10.8333 1.66927 10.8333H2.5526C2.74136 12.5232 3.49915 14.0986 4.70152 15.301C5.90389 16.5034 7.47937 17.2612 9.16927 17.4499V18.3333C9.16927 18.7916 9.54427 19.1666 10.0026 19.1666C10.4609 19.1666 10.8359 18.7916 10.8359 18.3333V17.4499C12.5258 17.2612 14.1013 16.5034 15.3037 15.301C16.5061 14.0986 17.2638 12.5232 17.4526 10.8333H18.3359C18.7943 10.8333 19.1693 10.4583 19.1693 9.99992C19.1693 9.54159 18.7943 9.16659 18.3359 9.16659H17.4526V9.16659ZM10.0026 15.8333C6.7776 15.8333 4.16927 13.2249 4.16927 9.99992C4.16927 6.77492 6.7776 4.16659 10.0026 4.16659C13.2276 4.16659 15.8359 6.77492 15.8359 9.99992C15.8359 13.2249 13.2276 15.8333 10.0026 15.8333Z" fill="#4043FF"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Weight</h3>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-6 h-6 rounded flex items-center justify-center shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.1733 2.09421C10.4203 1.78891 9.57801 1.78891 8.825 2.09421L7 2.83421L14.9933 5.94254L17.805 4.85671C17.6898 4.76106 17.5605 4.68376 17.4217 4.62754L11.1733 2.09421V2.09421Z" fill="#212121"/>
                                            <path d="M18.3333 5.99268L10.625 8.97101V18.0735C10.8117 18.036 10.995 17.9802 11.1742 17.9077L17.4225 15.3743C17.6916 15.2653 17.9221 15.0784 18.0844 14.8376C18.2466 14.5968 18.3333 14.3131 18.3333 14.0227V5.99351V5.99268Z" fill="#212121"/>
                                            <path d="M9.3724 18.0735V8.97101L1.66406 5.99268V14.0235C1.66423 14.3137 1.75099 14.5973 1.91325 14.838C2.07551 15.0786 2.30589 15.2654 2.5749 15.3743L8.82323 17.9077C9.0024 17.9802 9.18573 18.0352 9.3724 18.0743V18.0735Z" fill="#212121"/>
                                            <path d="M2.19531 4.85654L10.0011 7.87238L13.2653 6.61071L5.31281 3.51904L2.57865 4.62738C2.43698 4.68488 2.30865 4.76238 2.19531 4.85654V4.85654Z" fill="#212121"/>
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
                                                Rate Estimate
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="pt-2 pb-4 space-y-3">
                                            <p className="text-sm text-gray-500" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                {pricingResult.pricing_type}
                                            </p>
                                            {'price' in pricingResult && pricingResult.price ? (
                                                <p className="text-2xl font-bold text-[#4043FF]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                                    {pricingResult.price.currency === 'NGN' ? '₦' : `${pricingResult.price.currency} `}
                                                    {pricingResult.price.amount.toLocaleString()}
                                                </p>
                                            ) : pricingResult.export_price ? (
                                                <div className="space-y-2">
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