'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import {
  useAdminShipments,
  useAdminAllUsers,
  useAdminActivityLogs,
  useAdminRateChecks,
} from '@/hooks/use-admin'
import type { ActivityLog, RateCheck } from '@/lib/api/admin-api'
import type { ShipmentData } from '@/lib/api/types'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDateTime } from '@/lib/utils'

/* Live-status pipeline. Backend lifecycle: UNPAID → SUBMITTED → ON_PROCESS
   → DELIVERED → CANCELLED. Legacy literals (PENDING/ONGOING/SUCCESSFUL) are
   bucketed into the current schema so the funnel never shows a dead label. */
const PIPELINE_STAGES = [
  { key: 'UNPAID', label: 'Unpaid' },
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'ON_PROCESS', label: 'Processing' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
] as const

type StageKey = (typeof PIPELINE_STAGES)[number]['key']

function normalizeStatus(status?: string): StageKey {
  const s = (status ?? '').toUpperCase()
  if (s === 'DELIVERED' || s === 'SUCCESSFUL') return 'DELIVERED'
  if (s === 'ON_PROCESS' || s === 'ONGOING') return 'ON_PROCESS'
  if (s === 'CANCELLED' || s === 'FAILED') return 'CANCELLED'
  if (s === 'UNPAID') return 'UNPAID'
  return 'SUBMITTED' // PENDING / SUBMITTED / unknown
}

function plural(count: number, singular: string, pluralWord = `${singular}s`) {
  return count === 1 ? singular : pluralWord
}

const STAGE_STYLES: Record<StageKey, { text: string; bar: string; badge: string }> = {
  UNPAID: { text: 'text-gray-500', bar: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600' },
  SUBMITTED: { text: 'text-blue-600', bar: 'bg-blue-500', badge: 'bg-blue-50 text-blue-600' },
  ON_PROCESS: { text: 'text-amber-600', bar: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600' },
  DELIVERED: { text: 'text-green-600', bar: 'bg-green-500', badge: 'bg-green-50 text-green-600' },
  CANCELLED: { text: 'text-red-600', bar: 'bg-red-500', badge: 'bg-red-50 text-red-600' },
}

function isSameDay(a: string | undefined, b: Date) {
  if (!a) return false
  const d = new Date(a)
  return (
    d.getFullYear() === b.getFullYear() && d.getMonth() === b.getMonth() && d.getDate() === b.getDate()
  )
}

function isSameMonth(a: string | undefined, b: Date) {
  if (!a) return false
  const d = new Date(a)
  return d.getFullYear() === b.getFullYear() && d.getMonth() === b.getMonth()
}

function logUserLabel(log: ActivityLog) {
  const name = [log.user?.first_name, log.user?.last_name].map((x) => x?.trim()).filter(Boolean).join(' ')
  if (name && log.user?.email) return `${name} (${log.user.email})`
  if (name) return name
  if (log.user?.email) return log.user.email
  return log.user_id ?? 'Unknown user'
}

function shortId(id?: string) {
  if (!id) return '—'
  return id.length > 12 ? `${id.slice(0, 8)}…` : id
}

function RateCheckRow({ check }: { check: RateCheck }) {
  const createdAt = typeof check.created_at === 'string' ? formatDateTime(check.created_at) : ''
  const from = typeof check.sender_address === 'string' ? check.sender_address : ''
  const to = typeof check.receiver_address === 'string' ? check.receiver_address : ''
  const price = typeof check.price === 'number' ? check.price : typeof check.total_price === 'number' ? check.total_price : null
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{from || '—'} → {to || '—'}</p>
        <p className="text-xs text-gray-500">{createdAt || '—'}</p>
      </div>
      {price != null && (
        <span className="text-sm font-bold text-[#4043FF] shrink-0">
          {check.currency === 'USD' ? '$' : '₦'}{price.toLocaleString()}
        </span>
      )}
    </div>
  )
}

export default function MonitorPage() {
  const { token, isLoading: authLoading } = useAuth()

  const shipmentsQuery = useAdminShipments({ limit: 200 })
  const allUsersQuery = useAdminAllUsers()
  const rateChecksQuery = useAdminRateChecks({ limit: 50 })
  const activityQuery = useAdminActivityLogs({ page: 1, limit: 20 })

  const shipments = useMemo(
    () => (Array.isArray(shipmentsQuery.data) ? shipmentsQuery.data : []),
    [shipmentsQuery.data],
  )
  const rateChecks = rateChecksQuery.data?.rateChecks ?? []
  const logs = activityQuery.data?.data?.logs ?? []
  const allUsers = useMemo(
    () => (Array.isArray(allUsersQuery.data?.users) ? allUsersQuery.data!.users! : []),
    [allUsersQuery.data],
  )

  const loading = authLoading || shipmentsQuery.isLoading || allUsersQuery.isLoading || rateChecksQuery.isLoading || activityQuery.isLoading
  const queryError = shipmentsQuery.error ?? allUsersQuery.error ?? rateChecksQuery.error ?? activityQuery.error
  const error = authLoading
    ? ''
    : !token
      ? 'You need to be signed in as an admin to view the monitor.'
      : queryError
        ? ((queryError as any)?.response?.status === 403
          ? "You don't have admin access to the monitor."
          : (queryError as any)?.response?.status === 401
            ? 'Your session has expired — please sign in again.'
            : 'Could not load monitor data.')
        : ''

  const now = new Date()

  // ---- KPIs ----
  const byStatus = useMemo(() => {
    const counts: Record<StageKey, number> = { UNPAID: 0, SUBMITTED: 0, ON_PROCESS: 0, DELIVERED: 0, CANCELLED: 0 }
    for (const shipment of shipments) counts[normalizeStatus(shipment.status)] += 1
    return counts
  }, [shipments])

  const inTransit = byStatus.SUBMITTED + byStatus.ON_PROCESS
  const deliveredThisMonth = shipments.filter((s) => normalizeStatus(s.status) === 'DELIVERED' && isSameMonth(s.created_at, now)).length

  const totalUsers = allUsersQuery.data?.totalItems ?? allUsers.length
  const newUsersToday = allUsers.filter((u) => isSameDay(u.created_at, now)).length
  const rateChecksToday = rateChecks.filter((rc) => isSameDay(rc.created_at, now)).length

  // ---- Pipeline ----
  const pipelineCounts = useMemo(() => {
    const records: Record<StageKey, number> = { ...byStatus }
    return PIPELINE_STAGES.map((stage) => ({ ...stage, count: records[stage.key], pct: 0 })).map((entry) => {
      const total = shipments.length
      const pct = total > 0 ? (entry.count / total) * 100 : 0
      return { ...entry, pct }
    })
  }, [byStatus, shipments.length])

  // ---- Recent shipments (most recent first as returned) ----
  const recentShipments = useMemo(
    () =>
      shipments
        .slice()
        .sort((a, b) => ((b.created_at ?? '') < (a.created_at ?? '') ? -1 : ((b.created_at ?? '') > (a.created_at ?? '') ? 1 : 0))),
    [shipments],
  ).slice(0, 8)

  return (
    <div className="p-4 lg:p-6">
      <AdminPageHeader title="MONITOR" backHref="/home" />

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
        </div>
      ) : error ? (
        <EmptyState message={error} />
      ) : (
        <div className="space-y-6">
          {/* ---------------------------- KPI cards ---------------------------- */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">In Transit</p>
              <p className="text-3xl font-bold text-gray-900">{inTransit}</p>
              <p className="text-xs text-gray-500 mt-1">{plural(inTransit, 'shipment')} submitted or processing</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Delivered This Month</p>
              <p className="text-3xl font-bold text-gray-900">{deliveredThisMonth}</p>
              <p className="text-xs text-gray-500 mt-1">{now.toLocaleDateString(undefined, { month: 'long' })} {plural(deliveredThisMonth, 'delivery')}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Cancelled / Failed</p>
              <p className="text-3xl font-bold text-gray-900">{byStatus.CANCELLED}</p>
              <p className="text-xs text-gray-500 mt-1">{plural(byStatus.CANCELLED, 'order')} cancelled</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">
                +{newUsersToday} {plural(newUsersToday, 'new', 'new')} today
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Rate Checks Today</p>
              <p className="text-3xl font-bold text-gray-900">{rateChecksToday}</p>
              <p className="text-xs text-gray-500 mt-1">{plural(rateChecksToday, 'quote')} requested</p>
            </div>
          </div>

          {/* ------------------------- Pipeline funnel ------------------------- */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Shipment Pipeline</h2>
            {shipments.length === 0 ? (
              <p className="text-sm text-gray-500">No shipments yet.</p>
            ) : (
              <>
                <div className="flex h-3 rounded-full overflow-hidden mb-4 w-full">
                  {pipelineCounts.map((stage) =>
                    stage.count === 0 ? null : (
                      <div
                        key={stage.key}
                        title={`${stage.label}: ${stage.count}`}
                        className={STAGE_STYLES[stage.key].bar}
                        style={{ width: `${stage.pct}%` }}
                      />
                    ),
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {pipelineCounts.map((stage) => (
                    <div key={stage.key} className="flex items-center justify-between gap-1 rounded-lg bg-gray-50 px-3 py-2">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${STAGE_STYLES[stage.key].bar}`} />
                        <span className="text-xs font-medium text-gray-600 truncate">{stage.label}</span>
                      </span>
                      <span className={`text-sm font-bold shrink-0 ${STAGE_STYLES[stage.key].text}`}>{stage.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ---------------------- Recent shipments + feed ---------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent shipments */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 lg:p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Recent Shipments</h2>
              {recentShipments.length === 0 ? (
                <p className="text-sm text-gray-500">No shipments yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-bold text-gray-900 pb-2">Tracking</th>
                        <th className="text-left text-xs font-bold text-gray-900 pb-2">Route</th>
                        <th className="text-left text-xs font-bold text-gray-900 pb-2">Status</th>
                        <th className="text-right text-xs font-bold text-gray-900 pb-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentShipments.map((shipment) => {
                        const stage = normalizeStatus(shipment.status)
                        const style = STAGE_STYLES[stage]
                        return (
                          <tr key={shipment.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className="py-3 pr-3">
                              <Link
                                href={`/admin/orders/${shipment.id}`}
                                className="text-sm font-semibold text-[#4043FF] hover:underline"
                              >
                                {shipment.tracking_id || '—'}
                              </Link>
                            </td>
                            <td className="py-3 pr-3">
                              <p className="text-sm text-gray-700 truncate">
                                {shipment.sender_city || '?'} → {shipment.receiver_city || '?'}
                              </p>
                              {shipment.receiver_name && (
                                <p className="text-xs text-gray-500 truncate">To: {shipment.receiver_name}</p>
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
                                {stage}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <span className="text-xs text-gray-500">
                                {formatDateTime(shipment.created_at) || '—'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Activity feed + rate checks */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900">Activity</h2>
                  <Link href="/admin/settings/activity-logs" className="text-xs font-semibold text-[#4043FF] hover:underline">
                    View all
                  </Link>
                </div>
                {logs.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {logs.slice(0, 8).map((log) => (
                      <li key={log.id ?? `${log.user_id}-${log.created_at}`} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#4043FF] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-700 leading-snug">
                            <span className="font-semibold text-gray-900">{logUserLabel(log)}</span>
                            <span className="text-gray-500"> — {log.action ?? 'Action'}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDateTime(log.created_at)} · {shortId(log.id)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900">Recent Rate Checks</h2>
                  <Link href="/admin/rates" className="text-xs font-semibold text-[#4043FF] hover:underline">
                    View all
                  </Link>
                </div>
                {rateChecks.length === 0 ? (
                  <p className="text-sm text-gray-500">No rate checks yet.</p>
                ) : (
                  rateChecks.slice(0, 6).map((check) => <RateCheckRow key={check.id} check={check} />)
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}