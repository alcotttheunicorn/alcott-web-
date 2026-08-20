'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { getProfile } from '@/lib/api/profile-api'

export function useProfile() {
  const { token } = useAuth()

  const query = useQuery({
    queryKey: ['profile', token],
    queryFn: () => getProfile().then((res) => res.data),
    enabled: !!token,
  })

  const displayName = query.data
    ? [query.data.first_name, query.data.last_name].filter(Boolean).join(' ') || query.data.email
    : null

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    displayName,
  }
}