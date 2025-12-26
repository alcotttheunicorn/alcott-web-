'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState([
    '01/07/2024',
    '02/07/2024',
    '03/07/2024',
    '04/07/2024',
    '05/07/2024',
    '06/07/2024',
    '07/07/2024'
  ])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle clicking outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchFocus = () => {
    // Navigate to search page when search input is focused
    router.push('/search')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchValue(search)
    setIsSearchFocused(false)
    // Navigate to search page with the search term
    router.push(`/search?q=${encodeURIComponent(search)}`)
  }

  const handleClearAllRecents = () => {
    setRecentSearches([])
  }

  const handleTopUp = () => {
    console.log('Top Up clicked')
    router.push('/topup')
  }

  const handleQuickAction = (action: string) => {
    console.log(`${action} clicked`)
    switch (action) {
      case 'New Shipment':
        // Navigate to new shipment page
        router.push('/shipment/new')
        break
      case 'Check Rates':
        // Navigate to rates page
        router.push('/rates')
        break
      case 'Nearby Drop':
        // Navigate to nearby drop locations
        router.push('/locations')
        break
      case 'Help Center':
        // Navigate to help center
        router.push('/help')
        break
      default:
        alert(`${action} functionality coming soon!`)
    }
  }

  const handleSeeAllTransactions = () => {
    console.log('See All Transactions clicked')
    router.push('/transactions')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#4043FF] text-white flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#5A5DFF]">
          <div className="flex items-center">
            <img
              src="/alcott-white-logo-sidebar-home.png"
              alt="Alcott Logo"
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <Link href="/home" className="flex items-center px-4 py-3 rounded-lg bg-white/10 text-white font-[Urbanist] font-bold">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/orders" className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-[Urbanist] font-bold">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                My Order
              </Link>
            </li>
            <li>
              <Link href="/inbox" className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-[Urbanist] font-bold">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                Inbox
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-[Urbanist] font-bold">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative w-64 bg-[#4043FF] text-white flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header with close button */}
            <div className="p-6 border-b border-[#5A5DFF] flex items-center justify-between">
              <img
                src="/alcott-white-logo-sidebar-home.png"
                alt="Alcott Logo"
                className="h-8 w-auto"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-2">
                <li>
                  <Link href="/home" className="flex items-center px-4 py-3 rounded-lg bg-white/10 text-white font-[Urbanist] font-bold" onClick={() => setMobileMenuOpen(false)}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-[Urbanist] font-bold" onClick={() => setMobileMenuOpen(false)}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Order
                  </Link>
                </li>
                <li>
                  <Link href="/inbox" className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-[Urbanist] font-bold" onClick={() => setMobileMenuOpen(false)}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Inbox
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-[Urbanist] font-bold" onClick={() => setMobileMenuOpen(false)}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4" ref={searchRef}>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Type anything here to search"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:bg-white text-gray-900 placeholder:text-gray-500 font-[Urbanist] font-bold placeholder:font-bold"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                />

                {/* Recent Searches Dropdown */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                          Recent
                        </h3>
                        <button
                          onClick={handleClearAllRecents}
                          className="text-xs text-[#4043FF] font-bold hover:text-[#3333CC] font-[Urbanist]"
                          style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    <div className="py-2">
                      {recentSearches.length > 0 ? (
                        recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearchClick(search)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group transition-colors"
                          >
                            <span className="text-sm text-gray-700 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                              {search}
                            </span>
                            <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-gray-500 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                            No recent searches
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification dot */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>

              {/* Admin Button */}
              <button
                onClick={() => router.push('/admin/orders')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#4043FF] text-white text-sm font-bold rounded-lg hover:bg-[#3333CC] transition-colors font-[Urbanist]"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </button>

              {/* Currency Dropdown */}
              <div className="relative hidden md:block">
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist]"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                </select>
                <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>Olusegun Matanmi</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Dashboard Banner Card */}
          <section className="mb-6 lg:mb-8">
            <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl">
              {/* Card background image without container */}
              <img src="/home_card.png" alt="Balance card background" className="w-full h-auto" />

              {/* Stacked elements on card */}
              <div className="absolute inset-0 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
                {/* Left - Balance */}
                <div>
                  <p className="text-white/90 text-xs sm:text-sm font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Your balance</p>
                  <h3 className="text-white text-xl sm:text-3xl lg:text-4xl font-extrabold mt-1 sm:mt-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    941,800.00NGN
                  </h3>
                  <button
                    onClick={handleTopUp}
                    className="mt-2 sm:mt-4 bg-white text-[#4043FF] hover:bg-gray-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold shadow transition-colors font-[Urbanist] flex items-center gap-1"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 14l5-5 5 5z" />
                    </svg>
                    Top Up
                  </button>
                </div>

                {/* Right - Greeting */}
                <div className="hidden sm:block text-right">
                  <p className="text-white/90 text-xs lg:text-sm font-[Urbanist] flex items-center gap-1" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Good Morning
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.68 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.81-.34-3.68L23 12z" />
                    </svg>
                  </p>
                  <p className="text-white text-lg lg:text-xl font-bold font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Olusegun Matanmi</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            {[
              {
                label: 'New Shipment', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>)
              },
              {
                label: 'Check Rates', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3a8 8 0 100 16 8 8 0 008-8h-8z" /></svg>)
              },
              {
                label: 'Nearby Drop', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s7-4.434 7-12.5A7 7 0 105 9.5C5 17.566 12 22 12 22z" /></svg>)
              },
              {
                label: 'Help Center', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>)
              }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleQuickAction(item.label)}
                className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#E0E0FF] text-[#4043FF] flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-xs lg:text-sm font-bold text-gray-800 font-[Urbanist] text-center" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>{item.label}</span>
              </div>
            ))}
          </section>

          {/* Transaction History */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg md:text-xl font-extrabold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>Transaction History</h3>
              <button
                onClick={handleSeeAllTransactions}
                className="text-[#4043FF] text-sm font-bold hover:text-[#3333CC] transition-colors font-[Urbanist]"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
              >
                See All
              </button>
            </div>
            <div className="space-y-3 lg:space-y-4">
              {[
                { title: 'New Order Made!', desc: 'You have created a new shipping order', time: '2 hours ago', color: 'bg-blue-100 text-blue-600' },
                { title: 'Top Up Successful', desc: 'You successfully top up your e-wallet for ₦600,000', time: '4 hours ago', color: 'bg-green-100 text-green-600' },
                { title: 'Payment Successful', desc: 'Shipping payment of ₦40,000 successfully made', time: '1 day ago', color: 'bg-purple-100 text-purple-600' },
                { title: 'E-Wallet Connected!', desc: 'You have connected the e-wallet with Saska', time: '2 days ago', color: 'bg-orange-100 text-orange-600' }
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 flex items-start justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color} flex-shrink-0`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm font-bold text-gray-900 font-[Urbanist] truncate" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>{item.title}</p>
                      <p className="text-xs lg:text-sm text-gray-600 font-[Urbanist] line-clamp-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 font-[Urbanist] flex-shrink-0 ml-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>{item.time}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <div className="flex justify-around items-center">
          <Link href="/home" className="flex flex-col items-center p-2 text-[#4043FF]">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
            </svg>
            <span className="text-xs font-bold font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Dashboard</span>
          </Link>
          <Link href="/orders" className="flex flex-col items-center p-2 text-gray-500">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs font-bold font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Orders</span>
          </Link>
          <Link href="/inbox" className="flex flex-col items-center p-2 text-gray-500">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span className="text-xs font-bold font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Inbox</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center p-2 text-gray-500">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-bold font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
