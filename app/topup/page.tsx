'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { useInitializeFund } from '@/hooks/use-wallet'
import { toast } from '@/components/ui/use-toast'

interface SavedCard {
  id: string
  last4: string
  brand: string
  holder: string
}

const STORAGE_KEY = 'alcott_saved_cards'

function detectBrand(pan: string): string {
  if (/^4/.test(pan)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(pan)) return 'Mastercard'
  if (/^3[47]/.test(pan)) return 'Amex'
  if (/^6(011|5)/.test(pan)) return 'Discover'
  return 'Card'
}

function luhnCheck(digits: string): boolean {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

function isSavedCard(value: unknown): value is SavedCard {
  if (!value || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  return typeof c.id === 'string' && typeof c.last4 === 'string' && typeof c.brand === 'string'
}

function loadSavedCards(): SavedCard[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter(isSavedCard).map((c) => ({ ...c, holder: typeof c.holder === 'string' ? c.holder : '' }))
    }
  } catch {
    // ignore corrupted storage
  }
  return []
}

export default function TopUpPage() {
  return (
    <Suspense>
      <TopUpContent />
    </Suspense>
  )
}

function TopUpContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAmount, setSelectedAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedCardId, setSelectedCardId] = useState('')
  const [cards, setCards] = useState<SavedCard[]>(() => loadSavedCards())
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({ holder: '', number: '', expiry: '', cvc: '' })
  const router = useRouter()

  // Verification is handled globally by <VerifyPaymentHandler /> (mounted in
  // UserAppLayout), which also clears the ?reference= query param. The hook
  // versions invalidate wallet balance/transaction queries on success, so
  // /home and /transactions reflect the top-up without a manual refetch.
  // Per-call onSuccess below only handles page-local UI.
  const initializeFundMutation = useInitializeFund()
  const isProcessing = initializeFundMutation.isPending

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
    const amount = parseAmount(customAmount || selectedAmount)
    if (!amount || amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid top-up amount.' })
      return
    }
    setCurrentStep(2)
  }

  const handleContinueFromPayment = () => {
    const amount = parseAmount(customAmount || selectedAmount)
    if (!amount || amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid top-up amount.' })
      return
    }
    if (!selectedCardId) {
      toast({ title: 'Select a card', description: 'Please select a payment method to continue.' })
      return
    }

    initializeFundMutation.mutate(amount, {
      onSuccess: (res) => {
        const authorizationUrl = res.data?.authorization_url
        if (!authorizationUrl) {
          toast({ title: 'Payment setup incomplete', description: 'We could not get a payment link. Please try again.' })
          return
        }
        // Persist the reference BEFORE leaving for Paystack so the global
        // VerifyPaymentHandler can auto-verify on return — even if the
        // callback URL drops the ?reference= param or the user refreshes.
        if (res.data?.reference) {
          try {
            window.sessionStorage.setItem('alcott_pending_topup_ref', res.data.reference)
          } catch {
            // ignore storage errors
          }
        }
        window.location.href = authorizationUrl
      },
      onError: () => {
        toast({ title: 'Top-up failed', description: 'Could not initialize payment. Please try again.' })
      },
    })
  }

  const handleSaveCard = () => {
    const number = newCard.number.replace(/[\s-]/g, '')
    const holder = newCard.holder.trim()
    const digits = number.replace(/\D/g, '')
    if (!/^\d{13,19}$/.test(digits)) {
      toast({ title: 'Invalid card number', description: 'Please enter a valid card number.' })
      return
    }
    if (!luhnCheck(digits)) {
      toast({ title: 'Invalid card number', description: 'That card number did not pass the checksum test.' })
      return
    }
    const expiryMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(newCard.expiry.trim())
    if (!expiryMatch) {
      toast({ title: 'Invalid expiry', description: 'Use MM/YY format, e.g. 09/28.' })
      return
    }
    const now = new Date()
    const expYear = 2000 + Number(expiryMatch[2])
    const expMonth = Number(expiryMatch[1])
    if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
      toast({ title: 'Card expired', description: `This card expired in ${expiryMatch[1]}/${expiryMatch[2]}.` })
      return
    }
    if (!/^\d{3,4}$/.test(newCard.cvc.trim())) {
      toast({ title: 'Invalid CVC', description: 'Please enter the 3 or 4 digit security code.' })
      return
    }
    if (!holder) {
      toast({ title: 'Cardholder name required', description: 'Please enter the name on the card.' })
      return
    }

    const brand = detectBrand(digits)
    const duplicate = cards.some((c) => c.last4 === digits.slice(-4) && c.brand === brand && c.holder === holder)
    if (duplicate) {
      toast({ title: 'Card already saved', description: `${brand} •••• ${digits.slice(-4)} is already in your wallet.` })
      return
    }

    const card: SavedCard = {
      id: `card_${Date.now()}`,
      last4: digits.slice(-4),
      brand,
      holder,
    }
    const next = [...cards, card]
    setCards(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore quota errors
    }
    setSelectedCardId(card.id)
    setShowAddCard(false)
    setNewCard({ holder: '', number: '', expiry: '', cvc: '' })
  }

  const handleRemoveCard = (id: string) => {
    const next = cards.filter((c) => c.id !== id)
    setCards(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore quota errors
    }
    if (selectedCardId === id) setSelectedCardId('')
  }

  const formatAmount = (amount: string) => {
    if (amount === '1m') return '₦1,000,000'
    if (amount.includes('k')) {
      const num = amount.replace('k', '')
      return `₦${num},000`
    }
    return `₦${amount}`
  }

  const parseAmount = (amountStr: string): number => {
    let clean = amountStr.replace(/[₦,\s]/g, '').toLowerCase()
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  return (
    <UserAppLayout
      activeNav="home"
      headerTitle={{ title: 'Top Up Wallet', onBack: handleBack }}
    >
      <div className="max-w-8xl mx-auto p-4 lg:p-6 pb-20 lg:pb-6">
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
                  inputMode="decimal"
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
                  {formatAmount(amount)}
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinueFromAmount}
                disabled={isProcessing}
                className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-12 py-3 rounded-full font-[Urbanist] w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-gray-600 mb-8 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Select the top up method you want to use
              </p>
            </div>

            {/* Payment Method Cards */}
            <div className="max-w-md mx-auto space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-colors ${
                    selectedCardId === card.id
                      ? 'border-[#4043FF] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Card Icon */}
                      <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{card.brand === 'Mastercard' ? 'MC' : card.brand.slice(0, 4)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                          {card.brand} •••• {card.last4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveCard(card.id)
                        }}
                        aria-label={`Remove ${card.brand} card ending ${card.last4}`}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedCardId === card.id
                          ? 'border-[#4043FF] bg-[#4043FF]'
                          : 'border-gray-300'
                      }`}>
                        {selectedCardId === card.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Card Form */}
            {showAddCard && (
              <div className="max-w-md mx-auto border-2 border-[#E0E0FF] rounded-xl p-6 space-y-4">
                <p className="font-semibold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                  Add New Card
                </p>
                <input
                  type="text"
                  value={newCard.holder}
                  onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                  placeholder="Cardholder name"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-[Urbanist] focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={newCard.number}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '')
                    setNewCard({ ...newCard, number: digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim() })
                  }}
                  placeholder="Card number (e.g. 4111 1111 1111 1111)"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-[Urbanist] focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newCard.expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`
                      setNewCard({ ...newCard, expiry: v })
                    }}
                    placeholder="MM/YY"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-[Urbanist] focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={newCard.cvc}
                    onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="CVC"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-[Urbanist] focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSaveCard}
                    className="flex-1 bg-[#4043FF] hover:bg-[#3333CC] text-white py-3 rounded-full font-[Urbanist]"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  >
                    Save Card
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddCard(false)
                      setNewCard({ holder: '', number: '', expiry: '', cvc: '' })
                    }}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-full font-[Urbanist]"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 max-w-md mx-auto">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddCard((open) => !open)
                }}
                className="w-full border-2 border-[#E0E0FF] text-[#4043FF] bg-[#E0E0FF] hover:bg-[#D0D0FF] py-3 rounded-full font-[Urbanist]"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
              >
                Add New Card
              </Button>

              <Button
                onClick={handleContinueFromPayment}
                disabled={!selectedCardId || isProcessing}
                className="w-full bg-[#4043FF] hover:bg-[#3333CC] text-white py-3 rounded-full font-[Urbanist] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
              >
                {isProcessing ? 'Processing…' : 'Continue'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </UserAppLayout>
  )
}