'use client'

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { AdminListSkeleton } from '@/components/shared/skeletons'
import { useAdminActivityLogs } from '@/hooks/use-admin'
import type { ActivityLog } from '@/lib/api/admin-api'

const PAGE_SIZE = 10

function formatDateTime(value?: string) {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}


// UUIDs are 36 chars — show the distinguishing first 8 with the full value
// available on hover.
function shortId(id?: string) {
    if (!id) return '—'
    return id.length > 12 ? `${id.slice(0, 8)}…` : id
}

interface ParsedDetails {
    method?: string
    url?: string
    ip?: string
    body?: unknown
}

function parseDetails(raw?: string): ParsedDetails | null {
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') return parsed as ParsedDetails
        return null
    } catch {
        return null
    }
}

// Prefer the joined user record ("John Doe (john@x.com)") over the raw UUID;
// fall back to the user_id when the join is missing.
function displayLogUser(log: ActivityLog) {
    const name = [log.user?.first_name, log.user?.last_name]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(' ')
    if (name && log.user?.email) return { label: `${name} (${log.user.email})`, isId: false }
    if (name) return { label: name, isId: false }
    if (log.user?.email) return { label: log.user.email, isId: false }
    if (log.user_id) return { label: log.user_id, isId: true }
    return null
}

export default function ActivityLogsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const { data, isLoading: loading, error: queryError } = useAdminActivityLogs({ page: currentPage, limit: PAGE_SIZE })

    const logs = data?.data?.logs ?? []
    const totalPages = data?.totalPages || 1
    const totalItems = data?.totalItems ?? 0

    const error = queryError
        ? ((queryError as any)?.response?.status === 403
            ? "You don't have admin access to activity logs."
            : (queryError as any)?.response?.status === 404
                ? 'Activity logs are not available on the backend yet.'
                : 'Could not load activity logs.')
        : ''

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            <AdminPageHeader title="ACTIVITY LOGS" backHref="/admin/users" />

            {loading ? (
                <AdminListSkeleton count={PAGE_SIZE} />
            ) : error ? (
                <EmptyState message={error} />
            ) : logs.length === 0 ? (
                <EmptyState message="No activity logs found." />
            ) : (
                <>
                    <div className="space-y-6 lg:space-y-8 pl-2 lg:pl-6 pr-2 lg:pr-8">
                        {logs.map((log, index) => {
                            const createdAt = formatDateTime(log.created_at)
                            const key = log.id ?? `${log.user_id ?? 'unknown'}-${log.created_at ?? index}`
                            const user = displayLogUser(log)
                            const details = parseDetails(log.details)
                            const detailsJson = details ?? log.details

                            return (
                                <div key={key} className="flex flex-col gap-1">
                                    <h3 className="text-sm lg:text-base font-bold text-gray-900">{log.action ?? 'Unknown action'}</h3>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                                        <p className="text-xs lg:text-sm text-gray-600">
                                            Log ID: <span className="font-mono text-[#4043FF] font-medium" title={log.id}>{shortId(log.id)}</span>
                                        </p>
                                        {user && (
                                            <p className="text-xs lg:text-sm text-gray-600">
                                                User:{' '}
                                                {user.isId ? (
                                                    <span className="font-mono text-[#4043FF] font-medium" title={user.label}>{shortId(user.label)}</span>
                                                ) : (
                                                    <span className="text-gray-700 font-medium">{user.label}</span>
                                                )}
                                            </p>
                                        )}
                                        {createdAt && (
                                            <p className="text-xs lg:text-sm text-gray-600">
                                                Date: <span className="text-gray-700 font-medium">{createdAt}</span>
                                            </p>
                                        )}
                                    </div>
                                    {details && (
                                        <p className="text-xs lg:text-sm text-gray-500 font-mono">
                                            {details.method} {details.url}{details.ip ? ` · IP ${details.ip}` : ''}
                                        </p>
                                    )}
                                    {log.details && (
                                        <details className="mt-1">
                                            <summary className="text-xs text-[#4043FF] font-medium cursor-pointer select-none">Details</summary>
                                            <pre className="mt-2 text-xs bg-gray-50 border border-gray-100 rounded-lg p-3 overflow-x-auto text-gray-600 whitespace-pre-wrap break-all">
                                                {typeof detailsJson === 'string' ? detailsJson : JSON.stringify(detailsJson, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-[#4043FF] text-sm font-semibold hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                        >
                            &lt; Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-6 h-6 rounded text-sm font-semibold ${currentPage === page ? 'bg-[#4043FF] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="text-[#4043FF] text-sm font-semibold hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                        >
                            Next &gt;
                        </button>
                    </div>

                    {totalItems > 0 && (
                        <p className="text-center text-xs text-gray-400 mt-3">
                            Showing page {currentPage} of {totalPages} ({totalItems} logs)
                        </p>
                    )}
                </>
            )}
        </div>
    )
}
