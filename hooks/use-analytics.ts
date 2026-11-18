'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { isAdmin } from '@/lib/rbac'
import { queryKeys } from '@/components/providers/query-provider'
import {
  getAnalyticsOverview,
  getAnalyticsTimeseries,
  getAnalyticsPages,
  getAnalyticsReferrers,
  getAnalyticsDevices,
  type AnalyticsRangeParams,
  type AnalyticsPagedParams,
} from '@/lib/api/analytics-api'

// All reporting hooks require an authenticated ADMIN. They share the same
// gate the rest of the admin hooks use (enabled: isAuthenticated && isAdmin).

export function useAnalyticsOverview(params?: AnalyticsRangeParams) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.admin.analytics.overview(params),
    queryFn: () => getAnalyticsOverview(params).then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useAnalyticsTimeseries(params?: AnalyticsRangeParams) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.admin.analytics.timeseries(params),
    queryFn: () => getAnalyticsTimeseries(params).then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useAnalyticsPages(params?: AnalyticsPagedParams) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.admin.analytics.pages(params),
    queryFn: () => getAnalyticsPages(params),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useAnalyticsReferrers(params?: AnalyticsPagedParams) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.admin.analytics.referrers(params),
    queryFn: () => getAnalyticsReferrers(params),
    enabled: isAuthenticated && hasAdminAccess,
  })
}

export function useAnalyticsDevices(params?: AnalyticsRangeParams) {
  const { isAuthenticated, user } = useAuth()
  const hasAdminAccess = isAdmin(user?.role)

  return useQuery({
    queryKey: queryKeys.admin.analytics.devices(params),
    queryFn: () => getAnalyticsDevices(params).then((res) => res.data),
    enabled: isAuthenticated && hasAdminAccess,
  })
}
