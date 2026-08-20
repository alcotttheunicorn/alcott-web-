'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/components/ui/use-toast'

// Confirmed via real sign-in responses (both a USER and ADMIN account) that
// the backend sends role as uppercase: "USER" / "ADMIN". Comparison below is
// still case-insensitive as a defensive default in case that varies by
// endpoint or changes later.
const ADMIN_ROLE = 'ADMIN'

export function RoleGuard({
  children,
  role = ADMIN_ROLE,
}: {
  children: React.ReactNode
  role?: string
}) {
  const router = useRouter()
  const { token, user, isLoading } = useAuth()

  const hasRole = (user?.role ?? '').toLowerCase() === role.toLowerCase()

  useEffect(() => {
    if (isLoading) return

    if (!token) {
      router.replace('/lets-get-you-in')
      return
    }

    if (!hasRole) {
      toast({
        title: 'Access denied',
        description: "You don't have permission to view this page.",
      })
      router.replace('/home')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, isLoading, hasRole, router])

  if (isLoading || !token || !hasRole) return null

  return <>{children}</>
}