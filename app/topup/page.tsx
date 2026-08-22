'use client'

import { Suspense, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { SuccessModal } from '@/components/ui/success-modal'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { PageHeading, StatusTabs } from '@/components/user/page-primitives'
import { useAuth } from '@/hooks/use-auth'
import { initializeFund, verifyFund } from '@/lib/api/wallet-api'
import { toast } from '@/components/ui/use-toast'

const PRESET_AMOUNTS = ['10k', '20k', '50k', '100k', '200k', '250k', '500k', '750k', '1m']

function parseAmount(value: string) {
  const clean = value.replace(/[₦,\s]/g, '').toLowerCase()
  if (clean.endsWith('k')) return Number(clean.slice(0, -1)) * 1000
  if (clean.endsWith('m')) return Number(clean.slice(0, -1)) * 1_000_000
  return Number(clean)
}

function AmountStep({ amount, onAmountChange }: { amount: string; onAmountChange: (amount: string) => void }) {
  return(
    <>
      <p className="text-gray-600 mb-4">Choose an amount to add to your wallet.</p>
      <input 
        value={amount} 
        onChange={(event) => onAmountChange(event.target.value)} 
        placeholder="₦0" 
        inputMode="decimal" 
        className="w-full rounded-lg border p-4 text-lg mb-4" 
      />
      <div className="grid grid-cols-3 gap-3">
        {PRESET_AMOUNTS.map((preset) => 
          <button key={preset} 
            onClick={() => onAmountChange(preset)} 
            className={`rounded-lg border py-3 ${amount === preset ? 'border-[#4043FF] bg-[#E8E9FF] text-[#4043FF]' : 'bg-white'}`}
          >
            ₦{preset}
          </button>)
        }
      </div>
    </>
  )
}

function PaymentStep({ amount }: { amount: string }) {
  const tabs = [{ value: 'card', label: 'Card' }, { value: 'bank', label: 'Bank transfer' }] as const
  return (
    <>
      <p className="text-gray-600 mb-4">Confirm your payment method.</p>
      <StatusTabs options={tabs} value="card" onChange={() => undefined} />
      <div className="rounded-xl border bg-white p-5">
        <p className="text-sm text-gray-500">Amount</p>
        <p className="text-2xl font-bold">₦{parseAmount(amount).toLocaleString()}</p>
      </div>
    </>
  )
}

function TopUpContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { token } = useAuth()
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'amount' | 'payment'>('amount')
  const [success, setSuccess] = useState(false)

  const verify = useMutation({ 
    mutationFn: verifyFund, 
    onSuccess: () => setSuccess(true), 
    onError: () => toast({ title: 'Verification failed', description: 'Payment could not be verified. Please check your wallet.' }) 
  })

  const initialize = useMutation({ 
    mutationFn: initializeFund, 
    onSuccess: (response) => { if (response.data?.authorization_url) window.location.href = response.data.authorization_url }, 
    onError: () => toast({ title: 'Top-up failed', description: 'Could not initialize payment. Please try again.' }) 
  })

  useEffect(() => { 
    const reference = params.get('reference'); 
    if (reference && token) verify.mutate(reference) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, token])

  const proceed = () => { 
    const value = parseAmount(amount); 
    if (!value || value <= 0) return toast({ title: 'Invalid amount', description: 'Please enter a valid top-up amount.' }); 
    if (step === 'amount') setStep('payment'); else initialize.mutate(value) }
  return (
    <UserAppLayout contentBgClass="bg-[#F8F9FA]">
      <div className="max-w-xl mx-auto p-4 lg:p-6">
        <PageHeading title="Top up wallet" onBack={() => step === 'payment' ? setStep('amount') : router.back()} />
        {step === 'amount' ? 
          <AmountStep amount={amount} onAmountChange={setAmount} /> : <PaymentStep amount={amount} />
        }
        <button 
          disabled={initialize.isPending || verify.isPending} onClick={proceed} 
          className="mt-6 w-full rounded-lg bg-[#4043FF] py-3 text-white font-bold disabled:opacity-50"
        >
          {step === 'amount' ? 'Continue' : initialize.isPending ? 'Starting payment…' : 'Pay now'}
        </button>
        <SuccessModal 
          isOpen={success} 
          onClose={() => { setSuccess(false); router.push('/home') }} 
          title="Top up successful" message="Your wallet balance has been updated." 
        />
      </div>
    </UserAppLayout>
  )
}

export default function TopUpPage() { 
  return (
    <Suspense fallback={null}>
      <TopUpContent />
    </Suspense> 
  )}
