'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ShipmentSuccessPage() {
  const router = useRouter()

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
            Your tracking number is <span className="font-semibold text-[#4043FF]">156436770922</span>. A courier will reach out to pick up your package shortly.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push('/receipt/156436770922')}
            className="h-12 rounded-full bg-[#4043FF] hover:bg-[#3333CC] text-white font-semibold"
          >
            View E-Receipt
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


