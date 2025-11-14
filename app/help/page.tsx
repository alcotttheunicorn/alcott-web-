'use client'

import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

type FAQCategory = 'general' | 'account' | 'shipping' | 'cost'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: FAQCategory
}

export default function HelpCenterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq')
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('general')
  const [expandedFAQ, setExpandedFAQ] = useState<string>('what-is-alcott')
  const [faqSearch, setFaqSearch] = useState('')
  const [message, setMessage] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  const faqs: FAQItem[] = [
    {
      id: 'what-is-alcott',
      question: 'What is Alcott?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      category: 'general',
    },
    {
      id: 'how-to-use',
      question: 'How to use Alcott?',
      answer: 'To use Alcott, simply create an account, add your shipping details, and start creating shipments. You can track your packages in real-time and manage all your shipping needs from one dashboard.',
      category: 'general',
    },
    {
      id: 'create-shipping',
      question: 'Can I create my own shipping?',
      answer: 'Yes, you can create your own shipping orders through the "New Shipment" feature. Fill in the sender and receiver details, package information, and select your preferred shipping option.',
      category: 'shipping',
    },
    {
      id: 'is-free',
      question: 'Is Alcott free to use?',
      answer: 'Alcott offers both free and premium features. Basic shipping services are available with a free account, while advanced features may require a subscription.',
      category: 'account',
    },
    {
      id: 'make-offer',
      question: 'How to make offer on Alcott?',
      answer: 'You can make offers on shipments through the marketplace feature. Browse available shipments and submit your bid through the offer system.',
      category: 'general',
    },
    {
      id: 'free-shipping',
      question: 'Can I get free shipping?',
      answer: 'Free shipping may be available for certain promotions or subscription plans. Check our current offers and subscription benefits for more details.',
      category: 'cost',
    },
    {
      id: 'question',
      question: 'Question',
      answer: 'This is a placeholder question. Please contact support for more information.',
      category: 'general',
    },
  ]

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

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? '' : id)
  }

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Help Center</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('faq')}
                className={`pb-3 px-1 font-semibold transition-colors ${
                  activeTab === 'faq'
                    ? 'text-[#4043FF] border-b-2 border-[#4043FF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={{ fontFamily: "'Urbanist', sans-serif" }}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`pb-3 px-1 font-semibold transition-colors ${
                  activeTab === 'contact'
                    ? 'text-[#4043FF] border-b-2 border-[#4043FF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={{ fontFamily: "'Urbanist', sans-serif" }}
              >
                Contact us
              </button>
            </div>

            {activeTab === 'faq' && (
              <>
                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {(['general', 'account', 'shipping', 'cost'] as FAQCategory[]).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                        activeCategory === category
                          ? 'bg-[#4043FF] text-white'
                          : 'bg-white border border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white'
                      }`}
                      style={{ fontFamily: "'Urbanist', sans-serif" }}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                {/* FAQ Search */}
                <div className="relative mb-6">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                    style={{ fontFamily: "'Urbanist', sans-serif" }}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>

                {/* FAQ List */}
                <div className="space-y-3 mb-8">
                  {filteredFAQs.map((faq) => {
                    const isExpanded = expandedFAQ === faq.id
                    return (
                      <div
                        key={faq.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-4" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {faq.question}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 text-gray-600" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {activeTab === 'contact' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-6" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Get in touch with our support team. We're here to help!
                </p>
                {/* Contact form can be added here */}
              </div>
            )}

            {/* Message Input */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                    style={{ fontFamily: "'Urbanist', sans-serif" }}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
                <button className="w-12 h-12 bg-[#4043FF] text-white rounded-full flex items-center justify-center hover:bg-[#3333CC] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
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
          <SidebarLink href="/shipment/new" icon={OrderIcon} label="My Order" />
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
            <SidebarLink href="/shipment/new" icon={OrderIcon} label="My Order" onClick={onClose} mobile />
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
        <BottomNavLink href="/shipment/new" label="My Order" icon={OrderIcon} />
        <BottomNavLink href="/inbox" label="Inbox" icon={InboxIcon} />
        <BottomNavLink href="/settings" label="Settings" icon={SettingsIcon} />
      </nav>
    </div>
  )
}

