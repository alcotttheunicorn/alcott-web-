'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SuccessCard } from '@/components/ui/success-card'
import { AuthGuard } from '@/components/auth-guard'
import { Button } from '@/components/ui/button'

function SuccessContent() {
  const [showCard, setShowCard] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show card after a brief delay for better UX
    const timer = setTimeout(() => {
      setShowCard(true)
    }, 300)

    // Auto-redirect to home shortly after so the user is never stuck here.
    const redirectTimer = setTimeout(() => {
      router.replace('/home')
    }, 1500)

    return () => {
      clearTimeout(timer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className={`transition-all duration-500 ${showCard ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <SuccessCard
          title="Congratulations!"
          description="You will be redirected to the Home page in a few seconds."
          showSpinner={true}
        />
      </div>

      {/* Explicit escape hatch so completion never feels like a dead-end. */}
      <Button
        type="button"
        onClick={() => router.replace('/home')}
        className="mt-8 h-12 w-full max-w-lg rounded-full bg-[#4043FF] font-bold text-white hover:bg-[#3333CC]"
      >
        Go to Home
      </Button>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <AuthGuard>
      <SuccessContent />
    </AuthGuard>
  )
}
