'use client'

import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useCheckPricing } from '@/hooks/use-pricing'
import type { PricingResult } from '@/lib/api/types'
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
  const checkRatesMutation = useCheckPricing()
  const [pickupAddress, setPickupAddress] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [weight, setWeight] = useState('')
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)
  const [isCheckingRates, setIsCheckingRates] = useState(false)

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
    <div className="min-h-screen bg-[#F3F9FD] flex flex-col">
      <TopContactBar />
      <LandingHeader />
      <MobileMenu />
      <HeroSection />
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
        onClearResult={() => setPricingResult(null)}
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
