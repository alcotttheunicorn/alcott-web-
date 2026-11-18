'use client'

import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useAuth } from '@/hooks/use-auth'
import {
  useAnalyticsOverview,
  useAnalyticsTimeseries,
  useAnalyticsPages,
  useAnalyticsReferrers,
  useAnalyticsDevices,
} from '@/hooks/use-analytics'
import type { AnalyticsBreakdownItem } from '@/lib/api/analytics-api'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { EmptyState } from '@/components/shared/EmptyState'

// ---- date helpers (YYYY-MM-DD, the format the API's from/to accept) --------
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}
function defaultRange(): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return { from: isoDate(from), to: isoDate(to) }
}

function formatCount(n: number): string {
  return typeof n === 'number' ? n.toLocaleString('en-NG') : '—'
}

// Shorten MM-DD on the chart axis so long ranges stay readable.
function shortDate(value: string): string {
  if (!value) return ''
  const parts = value.split('-')
  return parts.length === 3 ? `${parts[1]}/${parts[2]}` : value
}

// ------------------------------ breakdown bars -----------------------------
function BreakdownBlock({ title, items }: { title: string; items: AnalyticsBreakdownItem[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No data.</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 truncate">{item.name || 'Unknown'}</span>
                <span className="text-xs font-semibold text-gray-500 shrink-0">
                  {formatCount(item.count)} · {item.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#4043FF]"
                  style={{ width: `${Math.max(0, Math.min(100, item.percentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ------------------------------ small stat card ----------------------------
function MiniStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 break-all">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1 truncate">{hint}</p>}
    </div>
  )
}

// ------------------------------ pagination ---------------------------------
function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (p: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between pt-3">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50"
      >
        Prev
      </button>
      <span className="text-xs text-gray-500">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  )
}

export default function AnalyticsPage() {
  const { token, isLoading: authLoading } = useAuth()
  const [range, setRange] = useState<{ from: string; to: string }>(defaultRange)
  const [pagesPage, setPagesPage] = useState(1)
  const [referrersPage, setReferrersPage] = useState(1)
  const PAGE_LIMIT = 10

  const rangeParams = useMemo(() => ({ from: range.from, to: range.to }), [range.from, range.to])
  const pagesParams = useMemo(() => ({ ...rangeParams, page: pagesPage, limit: PAGE_LIMIT }), [rangeParams, pagesPage])
  const referrersParams = useMemo(() => ({ ...rangeParams, page: referrersPage, limit: PAGE_LIMIT }), [rangeParams, referrersPage])

  const overviewQuery = useAnalyticsOverview(rangeParams)
  const timeseriesQuery = useAnalyticsTimeseries(rangeParams)
  const pagesQuery = useAnalyticsPages(pagesParams)
  const referrersQuery = useAnalyticsReferrers(referrersParams)
  const devicesQuery = useAnalyticsDevices(rangeParams)

  const loading =
    authLoading ||
    overviewQuery.isLoading ||
    timeseriesQuery.isLoading ||
    pagesQuery.isLoading ||
    referrersQuery.isLoading ||
    devicesQuery.isLoading

  const queryError =
    overviewQuery.error ??
    timeseriesQuery.error ??
    pagesQuery.error ??
    referrersQuery.error ??
    devicesQuery.error

  const error = authLoading
    ? ''
    : !token
      ? 'You need to be signed in as an admin to view site analytics.'
      : queryError
        ? ((queryError as any)?.response?.status === 403
            ? "You don't have admin access to site analytics."
            : (queryError as any)?.response?.status === 401
              ? 'Your session has expired — please sign in again.'
              : 'Could not load analytics data.')
        : ''

  const overview = overviewQuery.data
  const chartData = timeseriesQuery.data?.timeseries ?? []
  const pageRows = pagesQuery.data?.data ?? []
  const referrerRows = referrersQuery.data?.data ?? []
  const devices = devicesQuery.data

  const applyRange = (next: { from: string; to: string }) => {
    setRange(next)
    setPagesPage(1)
    setReferrersPage(1)
  }

  return (
    <div className="p-4 lg:p-6">
      <AdminPageHeader title="SITE ANALYTICS" backHref="/home" />

      {/* Date range selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="from">From</label>
          <input
            id="from"
            type="date"
            value={range.from}
            max={range.to}
            onChange={(e) => applyRange({ ...range, from: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="to">To</label>
          <input
            id="to"
            type="date"
            value={range.to}
            min={range.from}
            onChange={(e) => applyRange({ ...range, to: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
          />
        </div>
        <button
          type="button"
          onClick={() => applyRange(defaultRange())}
          className="px-3 py-2 rounded-lg text-xs font-semibold text-[#4043FF] border border-[#4043FF] hover:bg-[#4043FF] hover:text-white transition-colors"
        >
          Last 30 days
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
        </div>
      ) : error ? (
        <EmptyState message={error} />
      ) : (
        <div className="space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniStat label="Page Views" value={formatCount(overview?.page_views ?? 0)} />
            <MiniStat label="Unique Visitors" value={formatCount(overview?.unique_visitors ?? 0)} />
            <MiniStat label="Sessions" value={formatCount(overview?.sessions ?? 0)} hint="30-min inactivity window" />
            <MiniStat
              label="Top Page"
              value={overview?.top_page?.path ?? '—'}
              hint={overview?.top_page ? `${formatCount(overview.top_page.page_views)} views` : undefined}
            />
          </div>

          {/* Timeseries */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Traffic Over Time</h2>
            {chartData.length === 0 ? (
              <p className="text-sm text-gray-500">No traffic in this range.</p>
            ) : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4043FF" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4043FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                    <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="page_views" name="Page views" stroke="#4043FF" fill="url(#pv)" strokeWidth={2} />
                    <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#22C55E" fill="transparent" strokeWidth={2} />
                    <Area type="monotone" dataKey="unique_visitors" name="Unique visitors" stroke="#F59E0B" fill="transparent" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top pages + referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Top Pages</h2>
              {pageRows.length === 0 ? (
                <p className="text-sm text-gray-500">No page data.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[360px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-bold text-gray-900 pb-2">Path</th>
                          <th className="text-right text-xs font-bold text-gray-900 pb-2">Views</th>
                          <th className="text-right text-xs font-bold text-gray-900 pb-2">Visitors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.map((row) => (
                          <tr key={row.path} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className="py-2.5 pr-3 text-sm text-gray-800 break-all">{row.path}</td>
                            <td className="py-2.5 text-right text-sm font-semibold text-gray-900">{formatCount(row.page_views)}</td>
                            <td className="py-2.5 text-right text-sm text-gray-500">{formatCount(row.unique_visitors)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={pagesQuery.data?.currentPage ?? 1} totalPages={pagesQuery.data?.totalPages ?? 1} onChange={setPagesPage} />
                </>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Referrers</h2>
              {referrerRows.length === 0 ? (
                <p className="text-sm text-gray-500">No referrer data.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[360px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-bold text-gray-900 pb-2">Source</th>
                          <th className="text-right text-xs font-bold text-gray-900 pb-2">Views</th>
                          <th className="text-right text-xs font-bold text-gray-900 pb-2">Visitors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrerRows.map((row) => (
                          <tr key={row.referrer} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className="py-2.5 pr-3 text-sm text-gray-800 break-all">{row.referrer}</td>
                            <td className="py-2.5 text-right text-sm font-semibold text-gray-900">{formatCount(row.page_views)}</td>
                            <td className="py-2.5 text-right text-sm text-gray-500">{formatCount(row.unique_visitors)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={referrersQuery.data?.currentPage ?? 1} totalPages={referrersQuery.data?.totalPages ?? 1} onChange={setReferrersPage} />
                </>
              )}
            </div>
          </div>

          {/* Devices / browsers / OS */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">Devices &amp; Browsers</h2>
              {devices && (
                <span className="text-xs text-gray-500">{formatCount(devices.total_page_views)} total page views</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BreakdownBlock title="Device type" items={devices?.devices ?? []} />
              <BreakdownBlock title="Browser" items={devices?.browsers ?? []} />
              <BreakdownBlock title="Operating system" items={devices?.operating_systems ?? []} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
