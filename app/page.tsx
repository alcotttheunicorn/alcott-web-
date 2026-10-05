'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useCheckPricing, useExchangeRate } from '@/hooks/use-pricing'
import { useCurrency } from '@/components/providers/currency-provider'
import type { PricingResult } from '@/lib/api/types'
import { TopContactBar } from '@/components/landing/TopContactBar'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { MobileMenu } from '@/components/landing/MobileMenu'
import { FAQSection } from '@/components/landing/FAQSection'
import { GlobalShoppingSection } from '@/components/landing/GlobalShoppingSection'
import { LogisticsTeamSection } from '@/components/landing/LogisticsTeamSection'
import { PerformanceMetricsSection } from '@/components/landing/PerformanceMetricsSection'
import { ServiceOfferingsSection } from '@/components/landing/ServiceOfferingsSection'
import { ShipmentBookingHero } from '@/components/landing/ShipmentBookingHero'
import { ShippingProcessSection } from '@/components/landing/ShippingProcessSection'
import { SiteFooterSection } from '@/components/landing/SiteFooterSection'
import { CustomerTestimonialsSection } from '@/components/landing/CustomerTestimonialsSection'
import { MobileAppDownloadSection } from '@/components/landing/MobileAppDownloadSection'


export default function HomePage() {
  const checkRatesMutation = useCheckPricing()
  const { currency } = useCurrency()
  const { data: exchangeRate } = useExchangeRate()
  const [pickupAddress, setPickupAddress] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [weight, setWeight] = useState('')
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)
  const [isCheckingRates, setIsCheckingRates] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('scrollbar-hidden')
    return () => root.classList.remove('scrollbar-hidden')
  }, [])

  const handleCheckRates = async (phoneNumber: string, email: string) => {
    if (!pickupAddress.trim() || !deliveryAddress.trim() || !weight.trim()) {
      toast({ title: 'Missing information', description: 'Please fill in all fields.' })
      return
    }

    const weightValue = parseFloat(weight)
    if (!Number.isFinite(weightValue) || weightValue <= 0) {
      toast({ title: 'Invalid weight', description: 'Please enter a valid weight.' })
      return
    }

    setIsCheckingRates(true)
    try {
      const response = await checkRatesMutation.mutateAsync({
        sender_address: pickupAddress.trim(),
        receiver_address: deliveryAddress.trim(),
        weight: weightValue,
        sender_email: email.trim() || undefined,
        sender_phone_number: phoneNumber.trim() || undefined,
      })
      setPricingResult(response.data)
    } catch {
      toast({ title: 'Could not fetch rates', description: 'Please try again later.' })
    } finally {
      setIsCheckingRates(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopContactBar />
      <LandingHeader />
      <MobileMenu />
      <main className="flex-1">
        <ShipmentBookingHero
          pickupAddress={pickupAddress}
          onPickupChange={setPickupAddress}
          deliveryAddress={deliveryAddress}
          onDeliveryChange={setDeliveryAddress}
          weight={weight}
          onWeightChange={setWeight}
          onCheckRates={handleCheckRates}
          isCheckingRates={isCheckingRates}
          pricingResult={pricingResult}
          displayCurrency={currency}
          ngnPerUsd={exchangeRate?.ngn_per_usd}
          onClearResult={() => setPricingResult(null)}
        />
        <MobileAppDownloadSection />
        <ServiceOfferingsSection />
        <GlobalShoppingSection />
        <ShippingProcessSection />
        <PerformanceMetricsSection />
        <FAQSection />
        <CustomerTestimonialsSection />
        <LogisticsTeamSection />
      </main>
      <SiteFooterSection />
    </div>
  )
}