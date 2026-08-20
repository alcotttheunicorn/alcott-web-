'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { checkPricing } from '@/lib/api/pricing-api'
import type { PricingResult } from '@/lib/api/types'
import { toast } from '@/components/ui/use-toast'
import { TopContactBar } from '@/components/landing/TopContactBar'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { MobileMenu } from '@/components/landing/MobileMenu'
import { HeroSection } from '@/components/landing/HeroSection'
import { CheckRatesSection } from '@/components/landing/CheckRatesSection'
import { ServicesSection } from '@/components/landing/ServicesSection'
import { WhyUseAlcottSection } from '@/components/landing/WhyUseAlcottSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { TestimonialsSection } from '@/components/testimonials-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  const [pickupAddress, setPickupAddress] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [weight, setWeight] = useState('')
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)

  const checkPricingMutation = useMutation({
    mutationFn: (weightValue: number) => checkPricing(pickupAddress.trim(), deliveryAddress.trim(), weightValue),
  })
  const isCheckingRates = checkPricingMutation.isPending

  const handleCheckRates = () => {
    if (!pickupAddress.trim() || !deliveryAddress.trim() || !weight.trim()) {
      toast({ title: 'Missing information', description: 'Please fill in all fields.' })
      return
    }

    const weightValue = parseFloat(weight) || 0
    if (weightValue <= 0) {
      toast({ title: 'Invalid weight', description: 'Please enter a valid weight.' })
      return
    }

    checkPricingMutation.mutate(weightValue, {
      onSuccess: (res) => {
        const hasPremiseShape = typeof res.data?.price?.amount === 'number'
        const hasZoneShape = typeof res.data?.export_price?.amount === 'number' || typeof res.data?.import_price?.amount === 'number'

        if (!hasPremiseShape && !hasZoneShape) {
          console.error('Unexpected /pricing/check response shape:', res)
          toast({
            title: 'Unexpected pricing response',
            description: "The server didn't return pricing in the expected format. Check the console for details.",
          })
          return
        }

        setPricingResult(res.data)
      },
      onError: (err: any) => {
        console.error('checkPricing failed:', err?.response?.data ?? err)
        toast({ title: 'Could not fetch rates', description: err?.response?.data?.message || 'Please try again later.' })
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#F3F9FD] flex flex-col">
      <div className="bg-[#F3F9FD]">
        <TopContactBar />
        <LandingHeader />
        <MobileMenu />
        <HeroSection />
      </div>

      <CheckRatesSection
        pickupAddress={pickupAddress}
        onPickupChange={setPickupAddress}
        deliveryAddress={deliveryAddress}
        onDeliveryChange={setDeliveryAddress}
        weight={weight}
        onWeightChange={setWeight}
        onCheckRates={handleCheckRates}
        isCheckingRates={isCheckingRates}
        pricingResult={pricingResult}
      />

      <ServicesSection />
      <WhyUseAlcottSection />
      <HowItWorksSection />
      <FAQSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
