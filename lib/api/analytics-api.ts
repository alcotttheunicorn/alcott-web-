import apiClient from '@/lib/api-client'
import type { ApiResponse } from './types'

// Site Visit Analytics — mirrors the backend spec.
// Paths are relative to apiClient's baseURL, which already includes `/api`
// (NEXT_PUBLIC_API_BASE_URL = https://.../api). So the spec's
// `/api/analytics/visits` is `/analytics/visits` here, and the admin
// endpoints are `/admin/analytics/*`.

/** Payload for POST /analytics/visits. `path` is required; others optional. */
export interface VisitPayload {
  path: string
  referrer?: string
  session_id?: string
  device_type?: string
  browser?: string
  os?: string
  country?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

/**
 * Fire-and-forget page-view beacon. The endpoint is public and resilient
 * (returns 200 even on server-side DB failures), and the caller swallows all
 * errors so analytics can never break the UI. The Bearer token is attached
 * automatically by the apiClient interceptor when a session exists, which is
 * how a visit gets tied to the authenticated user; otherwise it stays anonymous.
 */
export async function recordVisit(payload: VisitPayload): Promise<void> {
  await apiClient.post('/analytics/visits', payload)
}

// ---- Admin reporting -------------------------------------------------------

export interface AnalyticsDateRange {
  from: string
  to: string
}

/** Shared date-range query params. from/to accept YYYY-MM-DD or ISO 8601. */
export interface AnalyticsRangeParams {
  from?: string
  to?: string
}

export interface AnalyticsTopPage {
  path: string
  page_views: number
}

export interface AnalyticsOverviewData {
  date_range: AnalyticsDateRange
  page_views: number
  unique_visitors: number
  sessions: number
  top_page: AnalyticsTopPage | null
}

export async function getAnalyticsOverview(
  params?: AnalyticsRangeParams,
): Promise<ApiResponse<AnalyticsOverviewData>> {
  const { data } = await apiClient.get('/admin/analytics/overview', { params })
  return data
}

export interface AnalyticsTimeseriesPoint {
  date: string
  page_views: number
  unique_visitors: number
  sessions: number
}

export interface AnalyticsTimeseriesData {
  date_range: AnalyticsDateRange
  timeseries: AnalyticsTimeseriesPoint[]
}

export async function getAnalyticsTimeseries(
  params?: AnalyticsRangeParams,
): Promise<ApiResponse<AnalyticsTimeseriesData>> {
  const { data } = await apiClient.get('/admin/analytics/timeseries', { params })
  return data
}

export interface AnalyticsPageRow {
  path: string
  page_views: number
  unique_visitors: number
}

// NOTE: pages/referrers return a paginated envelope that also carries
// date_range + results and omits `limit`, so it does not match PaginatedResponse.
export interface AnalyticsPagesResult {
  status: string
  date_range: AnalyticsDateRange
  results: number
  totalItems: number
  totalPages: number
  currentPage: number
  data: AnalyticsPageRow[]
}

export interface AnalyticsPagedParams extends AnalyticsRangeParams {
  page?: number
  limit?: number
}

export async function getAnalyticsPages(
  params?: AnalyticsPagedParams,
): Promise<AnalyticsPagesResult> {
  const { data } = await apiClient.get('/admin/analytics/pages', { params })
  return data
}

export interface AnalyticsReferrerRow {
  referrer: string
  page_views: number
  unique_visitors: number
}

export interface AnalyticsReferrersResult {
  status: string
  date_range: AnalyticsDateRange
  results: number
  totalItems: number
  totalPages: number
  currentPage: number
  data: AnalyticsReferrerRow[]
}

export async function getAnalyticsReferrers(
  params?: AnalyticsPagedParams,
): Promise<AnalyticsReferrersResult> {
  const { data } = await apiClient.get('/admin/analytics/referrers', { params })
  return data
}

export interface AnalyticsBreakdownItem {
  name: string
  count: number
  percentage: number
}

export interface AnalyticsDevicesData {
  date_range: AnalyticsDateRange
  total_page_views: number
  devices: AnalyticsBreakdownItem[]
  browsers: AnalyticsBreakdownItem[]
  operating_systems: AnalyticsBreakdownItem[]
}

export async function getAnalyticsDevices(
  params?: AnalyticsRangeParams,
): Promise<ApiResponse<AnalyticsDevicesData>> {
  const { data } = await apiClient.get('/admin/analytics/devices', { params })
  return data
}
