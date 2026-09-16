'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { SuccessModal } from '@/components/ui/success-modal'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { HeaderActions } from '@/components/layout/HeaderActions'
import { useInitializeFund, useVerifyFund } from '@/hooks/use-wallet'
import { toast } from '@/components/ui/use-toast'

export default function TopUpPage() {
  return (
    <Suspense>
      <TopUpContent />
    </Suspense>
  )
}

function TopUpContent() {
  const { token } = useAuth()
  const { displayName } = useProfile()
  const searchParams = useSearchParams()
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAmount, setSelectedAmount] = useState('247,000')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()

  // The hook versions invalidate wallet balance/transaction queries on
  // success, so /home and /transactions reflect the top-up without a manual
  // refetch. Per-call onSuccess below only handles page-local UI.
  const verifyFundMutation = useVerifyFund()
  const initializeFundMutation = useInitializeFund()
  const isProcessing = verifyFundMutation.isPending || initializeFundMutation.isPending

  useEffect(() => {
    const ref = searchParams.get('reference')
    if (ref && token) {
      verifyFundMutation.mutate(ref, {
        onSuccess: () => setShowSuccessModal(true),
        onError: () => {
          toast({ title: 'Verification failed', description: 'Payment could not be verified. Please check your wallet.' })
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, token])

  const predefinedAmounts = [
    '10k', '20k', '50k',
    '100k', '200k', '250k',
    '500k', '750k', '1m'
  ]

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount)
    setCustomAmount(formatAmount(amount))
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    // Clear selected preset amount when typing custom amount
    setSelectedAmount('')
  }

  const handleContinueFromAmount = () => {
    setCurrentStep(2)
  }

  const parseAmount = (amountStr: string): number => {
    let clean = amountStr.replace(/[₦,\s]/g, '')
    if (clean.endsWith('k')) {
      clean = clean.replace('k', '')
      return parseFloat(clean) * 1000
    }
    if (clean.endsWith('m')) {
      clean = clean.replace('m', '')
      return parseFloat(clean) * 1000000
    }
    return parseFloat(clean) || 0
  }

  const handleContinueFromPayment = () => {
    const amount = parseAmount(customAmount || selectedAmount)
    if (!amount || amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid top-up amount.' })
      return
    }

    initializeFundMutation.mutate(amount, {
      onSuccess: (res) => {
        const authorizationUrl = res.data?.authorization_url
        if (authorizationUrl) {
          window.location.href = authorizationUrl
        }
      },
      onError: () => {
        toast({ title: 'Top-up failed', description: 'Could not initialize payment. Please try again.' })
      },
    })
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    router.push('/home')
  }

  const formatAmount = (amount: string) => {
    if (amount === '1m') return '₦1,000,000'
    if (amount.includes('k')) {
      const num = amount.replace('k', '')
      return `₦${num},000`
    }
    return `₦${amount}`
  }

  return (
    <AuthGuard>
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
              <Link href="/home" className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-[Urbanist] font-bold">
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
                  <Link href="/home" className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-[Urbanist] font-bold" onClick={() => setMobileMenuOpen(false)}>
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
          <div className="mx-auto flex w-full max-w-8xl items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Back Button and Title */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1)
                  } else {
                    router.back()
                  }
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Top Up Wallet
              </h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Type anything here to search"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:bg-white text-gray-900 placeholder:text-gray-500 font-[Urbanist] font-bold placeholder:font-bold"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <HeaderActions />
            <div className="hidden">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification dot */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
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
                  <p className="text-sm font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>{displayName ?? 'Guest'}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Top Up Content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-8xl mx-auto">
            {/* Step 1: Amount Selection */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-gray-600 mb-6 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Enter the amount of top up
                  </p>
                  
                  {/* Custom Amount Input */}
                  <div className="mb-8">
                    <input
                      type="text"
                      value={customAmount || ''}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="₦247,000"
                      className="w-full max-w-md mx-auto text-center text-2xl font-bold text-[#4043FF] bg-transparent border-2 border-gray-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist] placeholder:text-[#4043FF]"
                      style={{ fontFamily: 'Urbanist, system-ui, sans-serif', color: '#4043FF' }}
                    />
                  </div>
                </div>

                {/* Predefined Amount Buttons */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`px-6 py-3 rounded-full border-2 font-semibold transition-colors font-[Urbanist] ${
                        selectedAmount === amount
                          ? 'border-[#4043FF] bg-[#4043FF] text-white'
                          : 'border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white'
                      }`}
                      style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                    >
                      ₦{amount}
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                <div className="flex justify-center">
                  <Button 
                    onClick={handleContinueFromAmount}
                    className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-12 py-3 rounded-full font-[Urbanist] w-full max-w-md"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method Selection */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Auto Layout Vertical
                  </p>
                  <p className="text-gray-600 mb-8 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Select the top up method you want to use
                  </p>
                </div>

                {/* Payment Method Card */}
                <div className="max-w-md mx-auto">
                  <div 
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-colors ${
                      selectedPaymentMethod === 'card' 
                        ? 'border-[#4043FF] bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Card Icon */}
                        <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">CARD</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                            •••• •••• •••• 4679
                          </p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'card' 
                          ? 'border-[#4043FF] bg-[#4043FF]' 
                          : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'card' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 max-w-md mx-auto">
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-[#E0E0FF] text-[#4043FF] bg-[#E0E0FF] hover:bg-[#D0D0FF] py-3 rounded-full font-[Urbanist]"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  >
                    Add New Card
                  </Button>
                  
                  <Button 
                    onClick={handleContinueFromPayment}
                    disabled={!selectedPaymentMethod}
                    className="w-full bg-[#4043FF] hover:bg-[#3333CC] text-white py-3 rounded-full font-[Urbanist] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Top Up Successful!"
        message="The balance will be added to your wallet"
        buttonText="OK"
      />

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <div className="flex justify-around items-center">
          <Link href="/home" className="flex flex-col items-center p-2 text-gray-500">
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
    </AuthGuard>
  )
}