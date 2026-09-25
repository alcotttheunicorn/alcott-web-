'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { SuccessModal } from '@/components/ui/success-modal'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
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
  const searchParams = useSearchParams()
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Top Up Successful!"
        message="The balance will be added to your wallet"
        buttonText="OK"
      />
    </UserAppLayout>
  )
}