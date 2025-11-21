'use client'

import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'
import { toast } from '@/components/ui/use-toast'

export default function CheckRatesPage() {
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [weight, setWeight] = useState('0')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [rates, setRates] = useState<any[]>([])
  const [showRates, setShowRates] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchFocus = () => {
    router.push('/search')
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchValue(search)
    setIsSearchFocused(false)
  }

  const handleClearAllRecents = () => {
    setRecentSearches([])
  }

  const sanitizeDecimalInput = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '')
    const [integer, fraction] = cleaned.split('.')
    if (fraction !== undefined) {
      return `${integer}${fraction ? `.${fraction.replace(/\./g, '')}` : ''}`
    }
    return integer
  }

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

    setIsLoading(true)
    
    // Convert weight to kg if needed
    const weightInKg = weightUnit === 'lb' ? weightValue * 0.453592 : weightValue
    
    // Calculate rates based on weight (frontend calculation)
    // Base prices in NGN
    const baseRegularPrice = 12000
    const baseCargoPrice = 18000
    const baseExpressPrice = 24000
    
    // Adjust price based on weight (add 1000 NGN per kg above 1kg)
    const weightMultiplier = Math.max(1, Math.ceil(weightInKg))
    const weightAdjustment = (weightMultiplier - 1) * 1000
    
    const ratesData = [
      {
        id: 'regular',
        type: 'REGULAR',
        lower_eta: 3,
        upper_eta: 4,
        price: baseRegularPrice + weightAdjustment,
        currency: selectedCurrency,
      },
      {
        id: 'cargo',
        type: 'CARGO',
        lower_eta: 3,
        upper_eta: 5,
        price: baseCargoPrice + weightAdjustment,
        currency: selectedCurrency,
      },
      {
        id: 'express',
        type: 'EXPRESS',
        lower_eta: 1,
        upper_eta: 2,
        price: baseExpressPrice + weightAdjustment,
        currency: selectedCurrency,
      },
    ]

    // Convert to USD if selected currency is USD (approximate conversion: 1 USD = 1500 NGN)
    const convertedRates = ratesData.map((rate) => {
      if (selectedCurrency === 'USD') {
        return {
          ...rate,
          price: Math.round(rate.price / 1500),
          currency: 'USD',
        }
      }
      return rate
    })

    setRates(convertedRates)
    setShowRates(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      <DesktopSidebar />
      {mobileMenuOpen && <MobileSidebar onClose={() => setMobileMenuOpen(false)} />}

      <div className="flex-1 flex flex-col">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={(value) => setSelectedCurrency(value)}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onSearchFocus={handleSearchFocus}
          searchRef={searchRef}
          isSearchFocused={isSearchFocused}
          recentSearches={recentSearches}
          onRecentClick={handleRecentSearchClick}
          onClearRecent={handleClearAllRecents}
        />

        <main className="flex-1 px-4 lg:px-6 py-6 lg:py-8 overflow-y-auto bg-white">
          <div className="max-w-2xl mx-auto">
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
              <div className="relative">
                <div className="flex items-center gap-3">
                  {/* Radio button icon */}
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border-2 border-[#4043FF] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#4043FF]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pick up Location</label>
                    <input
                      type="text"
                      placeholder="Enter pickup location"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist]"
                      style={{ fontFamily: "'Urbanist', sans-serif" }}
                    />
                  </div>
                  {/* Target icon */}
                  <button className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dotted connecting line */}
              <div className="flex items-center pl-3">
                <div className="w-0.5 h-6 border-l-2 border-dashed border-gray-300" />
              </div>

              {/* Package Destination */}
              <div className="relative">
                <div className="flex items-center gap-3">
                  {/* Map pin icon */}
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Package Destination</label>
                    <input
                      type="text"
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist]"
                      style={{ fontFamily: "'Urbanist', sans-serif" }}
                    />
                  </div>
                  {/* Target icon */}
                  <button className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Dimension section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dimension</h2>
              <div className="flex items-center gap-3">
                {/* Scale icon */}
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={weight}
                    onChange={(e) => {
                      const sanitized = sanitizeDecimalInput(e.target.value)
                      setWeight(sanitized)
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist]"
                    style={{ fontFamily: "'Urbanist', sans-serif" }}
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent bg-white font-[Urbanist] font-semibold"
                    style={{ fontFamily: "'Urbanist', sans-serif" }}
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
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
            {showRates && rates.length > 0 && (
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
                    className="flex-shrink-0 p-2 text-[#4043FF] hover:bg-white rounded-lg transition-colors"
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

                {/* Rates List */}
                <div className="space-y-3">
                  {rates.map((rate) => {
                    const rateType = rate.type?.toLowerCase() || 'regular'
                    const rateLabel = rateType.charAt(0).toUpperCase() + rateType.slice(1)
                    const etaText = `${rate.lower_eta}-${rate.upper_eta} days`
                    const displayPrice = rate.currency === 'USD' ? `$${rate.price}` : `₦${rate.price.toLocaleString()}`

                    // Icon based on rate type
                    const getIcon = () => {
                      if (rateType === 'express') {
                        return (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )
                      } else if (rateType === 'cargo') {
                        return (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-4 0H6a2 2 0 00-2 2v2a2 2 0 002 2h6m0 0h2" />
                            <circle cx="6" cy="17" r="2" stroke="currentColor" fill="none" />
                            <circle cx="18" cy="17" r="2" stroke="currentColor" fill="none" />
                          </svg>
                        )
                      } else {
                        return (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        )
                      }
                    }

                    return (
                      <div
                        key={rate.id || rateType}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#E0E0FF] text-[#4043FF] flex items-center justify-center">
                          {getIcon()}
                        </div>

                        {/* Rate Info */}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {rateLabel}
                          </p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {etaText}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0">
                          <p className="text-lg font-bold text-[#4043FF]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {displayPrice}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
    </svg>
  )
}

function OrderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}

function InboxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  )
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
  mobile,
}: {
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  active?: boolean
  onClick?: () => void
  mobile?: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center px-4 py-3 rounded-lg transition-colors font-[Urbanist] font-bold ${
          active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        <Icon className={`w-5 h-5 ${mobile ? 'mr-3' : 'mr-3'}`} />
        {label}
      </Link>
    </li>
  )
}

function DesktopSidebar() {
  return (
    <div className="hidden lg:flex w-64 bg-[#4043FF] text-white flex-col">
      <div className="p-6 border-b border-[#5A5DFF]">
        <img src="/alcott-white-logo-sidebar-home.png" alt="Alcott Logo" className="h-10 w-auto" />
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <SidebarLink href="/home" icon={DashboardIcon} label="Dashboard" />
          <SidebarLink href="/orders" icon={OrderIcon} label="My Order" />
          <SidebarLink href="/inbox" icon={InboxIcon} label="Inbox" />
          <SidebarLink href="/settings" icon={SettingsIcon} label="Settings" />
        </ul>
      </nav>
    </div>
  )
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-64 bg-[#4043FF] text-white flex flex-col">
        <div className="p-6 border-b border-[#5A5DFF] flex items-center justify-between">
          <img src="/alcott-white-logo-sidebar-home.png" alt="Alcott Logo" className="h-8 w-auto" />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <SidebarLink href="/home" icon={DashboardIcon} label="Dashboard" onClick={onClose} mobile />
            <SidebarLink href="/orders" icon={OrderIcon} label="My Order" onClick={onClose} mobile />
            <SidebarLink href="/inbox" icon={InboxIcon} label="Inbox" onClick={onClose} mobile />
            <SidebarLink href="/settings" icon={SettingsIcon} label="Settings" onClick={onClose} mobile />
          </ul>
        </nav>
      </div>
    </div>
  )
}

function Header({
  mobileMenuOpen,
  onToggleMobileMenu,
  selectedCurrency,
  onCurrencyChange,
  searchValue,
  onSearchChange,
  onSearchFocus,
  searchRef,
  isSearchFocused,
  recentSearches,
  onRecentClick,
  onClearRecent,
}: {
  mobileMenuOpen: boolean
  onToggleMobileMenu: () => void
  selectedCurrency: string
  onCurrencyChange: (value: string) => void
  searchValue: string
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSearchFocus: () => void
  searchRef: React.RefObject<HTMLDivElement>
  isSearchFocused: boolean
  recentSearches: string[]
  onRecentClick: (search: string) => void
  onClearRecent: () => void
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <button onClick={onToggleMobileMenu} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex-1 max-w-md mx-4 lg:mx-8" ref={searchRef}>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Enter Tracking Number, Name or Email"
              value={searchValue}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:bg-white text-gray-900 placeholder:text-gray-500 font-bold"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            />
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500">Recent</span>
                  <button onClick={onClearRecent} className="text-xs text-[#4043FF] font-semibold">Clear All</button>
                </div>
                <div className="py-2">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => onRecentClick(search)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        {search}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">No recent searches</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="hidden md:block relative">
            <select
              value={selectedCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <div className="hidden md:block text-sm font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              Olusegun Matanmi
            </div>
            <svg className="hidden md:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}

function BottomNavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  active?: boolean
}) {
  return (
    <Link href={href} className={`flex flex-col items-center p-2 ${active ? 'text-[#4043FF]' : 'text-gray-500'}`}>
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-xs font-bold" style={{ fontFamily: "'Urbanist', sans-serif" }}>
        {label}
      </span>
    </Link>
  )
}

function MobileBottomNav() {
  return (
    <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <nav className="flex justify-around items-center">
        <BottomNavLink href="/home" label="Dashboard" icon={DashboardIcon} />
        <BottomNavLink href="/orders" label="My Order" icon={OrderIcon} />
        <BottomNavLink href="/inbox" label="Inbox" icon={InboxIcon} />
        <BottomNavLink href="/settings" label="Settings" icon={SettingsIcon} />
      </nav>
    </div>
  )
}

