'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = window.localStorage.getItem('authToken')
      ?? window.sessionStorage.getItem('authToken')

    if (!token) {
      router.replace('/lets-get-you-in')
    }
  }, [router])

  const token = typeof window !== 'undefined'
    ? (window.localStorage.getItem('authToken') ?? window.sessionStorage.getItem('authToken'))
    : null

  if (!token) return null

  return <>{children}</>
}
