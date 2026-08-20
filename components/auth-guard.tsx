'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (!token) {
      router.replace('/lets-get-you-in')
    }
  }, [token, isLoading, router])

  if (isLoading || !token) return null

  return <>{children}</>
}