'use client'

import { useEffect } from 'react'
import { refreshFromStorage } from '@/lib/auth-store'

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    refreshFromStorage()
  }, [])

  return <>{children}</>
}