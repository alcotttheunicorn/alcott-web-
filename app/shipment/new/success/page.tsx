'use client'

import { Suspense, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import { useVerifyShipmentPayment } from '@/hooks/use-shipments'
import type { ShipmentData } from '@/lib/api/types'

function loadLastCreatedShipment(): ShipmentData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem('lastCreatedShipment')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // POST /shipments returns { data: { shipment, quote } }, so unwrap `.shipment`.
    return parsed?.shipment ?? parsed ?? null
  } catch {
    return null
  }
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token } = useAuth()
  const [shipment, setShipment] = useState<ShipmentData | null>(null)
  const [status, setStatus] = useState<'checking' | 'ready' | 'failed'>('checking')
  const verifyPaymentMutation = useVerifyShipmentPayment()

  useEffect(() => {
    const reference = searchParams.get('reference')
    const stored = loadLastCreatedShipment()

    // Wallet payments: no Paystack reference in the URL, shipment is already confirmed.
    if (!reference) {
      setShipment(stored)
      setStatus('ready')
      return
    }

    // Card payments: Paystack redirected back here — confirm the payment actually went through.
    if (!token) return
    verifyPaymentMutation.mutate(reference, {
      onSuccess: () => {
        setShipment(stored)
        setStatus('ready')
      },
      onError: () => setStatus('failed'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, token])

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center px-6 py-16 text-center font-['Urbanist']">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-3xl shadow-lg p-10 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment couldn't be verified</h1>
          <p className="text-sm text-gray-600">
            We couldn't confirm your payment. If you were charged, check your orders in a few minutes or contact support.
          </p>
          <Button
            onClick={() => router.push('/orders')}
            className="h-12 rounded-full bg-[#4043FF] hover:bg-[#3333CC] text-white font-semibold"
          >
            Go to Orders
          </Button>
        </div>
      </div>
    )
  }

  const trackingId = shipment?.tracking_id

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center px-6 py-16 text-center font-['Urbanist']">
      <div className="max-w-lg w-full bg-white border border-gray-200 rounded-3xl shadow-lg p-10 space-y-6">
        <div className="mx-auto w-24 h-24 bg-[#4043FF]/10 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 animate-ping bg-[#4043FF]/20 rounded-full" />
          <div className="w-16 h-16 bg-[#4043FF] rounded-full flex items-center justify-center text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Order Successful!</h1>
          <p className="text-sm text-gray-600">
            {trackingId ? (
              <>Your tracking number is <span className="font-semibold text-[#4043FF]">{trackingId}</span>. A courier will reach out to pick up your package shortly.</>
            ) : (
              'A courier will reach out to pick up your package shortly.'
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push(shipment?.id ? `/orders/${shipment.id}` : '/orders')}
            className="h-12 rounded-full bg-[#4043FF] hover:bg-[#3333CC] text-white font-semibold"
          >
            View Order
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/home')}
            className="h-12 rounded-full border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white font-semibold"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ShipmentSuccessPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </AuthGuard>
  )
}