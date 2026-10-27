'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { useInitializeFund } from '@/hooks/use-wallet'
import { toast } from '@/components/ui/use-toast'

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
  const router = useRouter()
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

    initializeFundMutation.mutate(amount, {
      onSuccess: (res) => {
        const authorizationUrl = res.data?.authorization_url
        if (!authorizationUrl) {
          toast({ title: 'Payment setup incomplete', description: 'We could not get a payment link. Please try again.' })
          return
        }
        
        if (res.data?.reference) {
          try {
            // Store with a timestamp so the verify handler can ignore a stale
            // reference left behind by an abandoned checkout (see TTL in
            // verify-payment-handler.tsx).
            window.sessionStorage.setItem(
              'alcott_pending_topup_ref',
              JSON.stringify({ reference: res.data.reference, amount, ts: Date.now() }),
            )
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

  const formatAmount = (amount: string) => {
    // Compact chip labels so presets never spill out of their buttons on
    // small screens (e.g. "₦1,000,000" at 360px viewport).
    if (amount === '1m') return '₦1M'
    if (amount.includes('k')) {
      const num = amount.replace('k', '')
      return `₦${num}K`
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
              {/* <p className="text-gray-600 mb-6">
                Enter the amount of top up
              </p> */}

              {/* Custom Amount Input */}
              <div className="mb-8">
                <input
                  type="text"
                  inputMode="decimal"
                  value={customAmount || ''}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="₦0"
                  className="w-full max-w-md mx-auto text-center text-2xl font-bold text-[#4043FF] bg-transparent border-2 border-gray-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent placeholder:text-gray-400"
                  style={{ color: '#4043FF' }}
                />
              </div>
            </div>

            {/* Predefined Amount Buttons */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`px-6 py-3 rounded-full border-2 font-semibold whitespace-nowrap transition-colors ${
                    selectedAmount === amount
                      ? 'border-[#4043FF] bg-[#4043FF] text-white'
                      : 'border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white'
                  }`}

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
                className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-12 h-16 rounded-full w-full max-w-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"

              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Confirmation */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-gray-600 mb-8">
                You will complete this top up securely with our payment provider (Paystack). We never store your card details.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinueFromPayment}
                disabled={isProcessing}
                className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-12 h-16 rounded-full w-full max-w-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"

              >
                {isProcessing ? 'Processing…' : 'Continue to payment'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </UserAppLayout>
  )
}