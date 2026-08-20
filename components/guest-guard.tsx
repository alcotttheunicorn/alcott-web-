'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

// The inverse of AuthGuard. Wraps pages that only make sense for someone who
// ISN'T signed in yet — sign-in, register, forgot-password flow, the
// sign-in/sign-up chooser screen, email verification. Without this, a
// already-authenticated user could navigate back to /sign-in and either see
// a confusing "log in again" form, or in verify-email's case, an OTP screen
// for a signup flow they already completed.
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (token) {
      router.replace('/home')
    }
  }, [token, isLoading, router])

  // While auth state is resolving, or once we know they're signed in and are
  // about to be redirected, render nothing rather than flashing the
  // sign-in/register form first.
  if (isLoading || token) return null

  return <>{children}</>
}