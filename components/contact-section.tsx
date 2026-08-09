import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ContactSection() {
  return (
    <section className="bg-[#4043FF] py-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-12 text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            Get in touch with us
          </h2>
          <p className="text-lg text-white opacity-90 max-w-2xl mx-auto font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            If you need our help or have a question, We're here for you          </p>
        </div>

        {/* Email Subscription Form */}
        <div className="mb-8">
          <div className="flex max-w-md mx-auto bg-white rounded-full overflow-hidden shadow-lg">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 h-12 bg-white border-0 rounded-none px-6 text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:outline-none font-[Urbanist] text-base"
              style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
            />
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-base font-bold rounded-none h-12 whitespace-nowrap border-0 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              Subscribe Now
            </Button>
          </div>
          
          {/* Disclaimer */}
          <p className="text-white text-sm mt-4 opacity-80 font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            No ads. No trails. No commitments.
          </p>
        </div>

        {/* Statistics - Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
          {/* Years in Business */}
          <div className="text-center">
            <div className="text-5xl lg:text-6xl font-bold text-white mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>6+</div>
            <div className="text-lg font-bold text-white mb-1 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Years in Business</div>
            <div className="text-sm text-white opacity-80 font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Creating the successful path</div>
          </div>

          {/* Case Studies */}
          <div className="text-center">
            <div className="text-5xl lg:text-6xl font-bold text-white mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>15000+</div>
            <div className="text-lg font-bold text-white mb-1 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Packages Delivered</div>
            <div className="text-sm text-white opacity-80 font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>In last 6 years</div>
          </div>
        </div>

        {/* Statistics - Mobile Layout */}
        <div className="md:hidden space-y-8">
          {/* Years in Business */}
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>6+</div>
            <div className="text-xl font-bold text-white mb-1 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Years in Business</div>
            <div className="text-base text-white opacity-80 font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Creating the successful path</div>
          </div>

          {/* Case Studies */}
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>4821</div>
            <div className="text-xl font-bold text-white mb-1 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Case Studies Delivered</div>
            <div className="text-base text-white opacity-80 font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>In last 6 years</div>
          </div>
        </div>
      </div>
    </section>
  )
}
