'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { getProfile, setupProfile, updateProfile, resendPhoneOtp } from '@/lib/api/profile-api'
import { queryKeys } from '@/components/providers/query-provider'
import type { ProfileData } from '@/lib/api/types'

export function useProfile() {
  const { isAuthenticated } = useAuth()

  const query = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => getProfile().then((res) => res.data),
    enabled: isAuthenticated,
  })

  const displayName = query.data
    ? [query.data.first_name, query.data.last_name].filter(Boolean).join(' ') || query.data.email
    : null

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    displayName,
    query,
  }
}

export function useSetupProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => setupProfile(formData),
    onSuccess: (res) => {
      queryClient.setQueryData<ProfileData>(queryKeys.auth.profile, res.data)
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: (res) => {
      queryClient.setQueryData<ProfileData>(queryKeys.auth.profile, res.data)
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile })
    },
  })
}

export function useResendPhoneOtp() {
  return useMutation({
    mutationFn: () => resendPhoneOtp(),
  })
}
