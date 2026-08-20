'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/components/ui/use-toast'
import { hasAnyRole, ROLES } from '@/lib/rbac'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function RoleGuard({
  children,
  roles = [ROLES.ADMIN],
}: {
  children: React.ReactNode
  roles?: readonly string[]
}) {
  const router = useRouter()
  const { token, user, isLoading } = useAuth()

  const hasAccess = hasAnyRole(user?.role, roles)

  useEffect(() => {
    if (isLoading) return

    if (!token) {
      router.replace('/lets-get-you-in')
      return
    }

    if (!hasAccess) {
      toast({
        title: 'Access denied',
        description: "You don't have permission to view this page.",
      })
      router.replace('/home')
    }
  }, [token, user, isLoading, hasAccess, router])

  if (isLoading || !token || !hasAccess) return <LoadingSpinner />

  return <>{children}</>
}
