import { TopContactBar } from '@/components/landing/TopContactBar'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { MobileMenu } from '@/components/landing/MobileMenu'
import { HeroSection } from '@/components/shop-and-ship/HeroSection'
import { HowItWorksSection } from '@/components/shop-and-ship/HowItWorksSection'
import { ConsolidationSection } from '@/components/shop-and-ship/ConsolidationSection'
import { OrderBuilderSection } from '@/components/shop-and-ship/OrderBuilderSection'
import { SmartWeightSection } from '@/components/shop-and-ship/SmartWeightSection'
import { FaqSection } from '@/components/shop-and-ship/FaqSection'
import { PageFooter } from '@/components/shop-and-ship/PageFooter'

export default function ShopAndShipPage() {
  return (
    <div id="top" className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-50">
        <TopContactBar />
        <LandingHeader />
      </div>
      <MobileMenu />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <ConsolidationSection />
        <OrderBuilderSection />
        <SmartWeightSection />
        <FaqSection />
      </main>
      <PageFooter />
    </div>
  )
}
