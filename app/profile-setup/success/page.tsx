'use client'

import { useEffect, useState } from 'react'
import { SuccessCard } from '@/components/ui/success-card'
import { AuthGuard } from '@/components/auth-guard'

function SuccessContent() {
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    // Show card after a brief delay for better UX
    const timer = setTimeout(() => {
      setShowCard(true)
    }, 300)

    // Auto-redirect to home after 3 seconds
    const redirectTimer = setTimeout(() => {
      window.location.href = '/home'
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(redirectTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`transition-all duration-500 ${showCard ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <SuccessCard
          title="Congratulations!"
          description="You will be redirected to the Home page in a few seconds."
          showSpinner={true}
        />
      </div>
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