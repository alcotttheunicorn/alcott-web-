'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'
import { getProfile } from '@/lib/api/profile-api'
import type { ProfileData } from '@/lib/api/types'

// Several pages each need the signed-in user's display name/avatar (top-right
// profile pill). Rather than have every page call GET /profile on its own
// (settings/page.tsx and home/page.tsx already did this independently), this
// hook fetches once per token and shares the result across every component
// that calls it during the session — avoiding N duplicate requests per
// navigation. Cache is intentionally module-level (not React context) since
// there's no provider wrapping the app; this keeps the fix localized.
let cache: { token: string; profile: ProfileData } | null = null
let inFlight: { token: string; promise: Promise<ProfileData> } | null = null

export function useProfile() {
  const { token } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(
    cache && cache.token === token ? cache.profile : null
  )
  const [loading, setLoading] = useState(!profile && !!token)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    if (cache && cache.token === token) {
      setProfile(cache.profile)
      setLoading(false)
      return
    }

    setLoading(true)
    const promise =
      inFlight && inFlight.token === token
        ? inFlight.promise
        : getProfile(token).then((res) => res.data)

    inFlight = { token, promise }

    promise
      .then((data) => {
        cache = { token, profile: data }
        setProfile(data)
      })
      .catch(() => {
        // Leave profile null — consumers fall back to a generic label.
      })
      .finally(() => {
        if (inFlight?.token === token) inFlight = null
        setLoading(false)
      })
  }, [token])

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email
    : null

  return { profile, loading, displayName }
}