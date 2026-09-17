'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useAdminUsers, useAdminAllUsers } from '@/hooks/use-admin'
import type { AdminUser } from '@/lib/api/admin-api'

const PAGE_SIZE = 10

function displayName(user: AdminUser) {
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
    return name || user.email
}

function plural(count: number, singular: string, pluralWord = `${singular}s`) {
    return count === 1 ? singular : pluralWord
}

// Derives the current-calendar-year monthly signup serial for the chart
// (Mar → Sept columns). Months with no registrations still get a slot so the
// axis labels stay aligned, but they render as zero-height bars.
function monthlySeries(users: AdminUser[], year: number) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const counts = months.map(() => 0)
    for (const user of users) {
        if (!user.created_at) continue
        const d = new Date(user.created_at)
        if (d.getFullYear() === year) counts[d.getMonth()] += 1
    }
    return months.map((label, i) => ({ label, count: counts[i] }))
}

export default function UsersPage() {
    const { token, isLoading: authLoading } = useAuth()
    const [searchValue, setSearchValue] = useState('')
    const [selectedReportYear, setSelectedReportYear] = useState('last_year')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

    const { data, isLoading: queryLoading, error: queryError } = useAdminUsers({ page: currentPage, limit: PAGE_SIZE })
    const allUsersQuery = useAdminAllUsers()

    const users = data && Array.isArray(data.data?.users) ? data.data.users : []
    const totalPages = data?.totalPages || 1
    // Loads the full user list for the dashboard stats; falls back to the
    // current page's users only if the "fetch all" request hasn't resolved yet.
    const allUsers = useMemo(
        () => (allUsersQuery.data && Array.isArray(allUsersQuery.data.users) ? allUsersQuery.data.users : users),
        [allUsersQuery.data, users],
    )
    const totalUsers = allUsersQuery.data?.totalItems ?? users.length

    // authLoading itself counts as "loading" so the page shows a spinner
    // instead of flashing the "not signed in" error during the brief window
    // before useAuth resolves.
    const loading = authLoading || queryLoading || allUsersQuery.isLoading
    const error = authLoading
        ? ''
        : !token
            ? 'You need to be signed in as an admin to view users.'
            : queryError
                ? ((queryError as any)?.response?.status === 403
                    ? "You don't have admin access to view users."
                    : (queryError as any)?.response?.status === 401
                        ? 'Your session has expired — please sign in again.'
                        : 'Could not load users.')
                : ''

    // Auto-select the first user once the list loads, without stomping a
    // selection the admin already made by clicking a row.
    useEffect(() => {
        if (!selectedUser && users.length > 0) setSelectedUser(users[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users])

    // The /admin/users endpoint only documents page/limit params — no name/email
    // search filter. This filters within the current page only; it will not
    // search users outside of what's already been fetched.
    const visibleUsers = searchValue.trim()
        ? users.filter((u) =>
            displayName(u).toLowerCase().includes(searchValue.trim().toLowerCase()) ||
            u.email?.toLowerCase().includes(searchValue.trim().toLowerCase())
        )
        : users

    // ---- Dashboard stats derived from created_at/is_verified ----
    const now = new Date()
    const thisMonthUsers = useMemo(
        () => allUsers.filter((u) => {
            if (!u.created_at) return false
            const d = new Date(u.created_at)
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
        }),
        [allUsers, now],
    )
    const monthlyUsers = thisMonthUsers.length
    // No last-activity field is exposed on the admin user object, so "active"
    // is approximated with is_verified for now.
    const activeUsers = allUsers.filter((u) => u.is_verified === true).length
    const setDate = new Date().getDate()
    const newUsers = thisMonthUsers
        .slice()
        .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
        .map((u) => {
            const joined = u.created_at ? new Date(u.created_at) : null
            const joinedText = joined && joined.getDate() === setDate
                ? 'Joined Today'
                : joined
                    ? `Joined ${joined.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                    : 'Joined'
            return { id: u.id, name: displayName(u), joinedText, email: u.email ?? '', phone: u.phone_number ? `+${u.phone_number}` : '—' }
        })

    const chartSeries = useMemo(() => monthlySeries(allUsers, now.getFullYear()), [allUsers, now])

    // CSV export is generated client-side from the loaded users for the
    // selected report year — there's no /admin CSV endpoint.
    const reportYear = selectedReportYear === 'this_year' ? now.getFullYear() : selectedReportYear === 'last_year' ? now.getFullYear() - 1 : now.getFullYear() - 2
    const exportCsv = () => {
        const rows = allUsers
            .filter((u) => u.created_at && new Date(u.created_at).getFullYear() === reportYear)
            .map((u) => ({
                name: displayName(u),
                email: u.email ?? '',
                phone: u.phone_number ?? '',
                role: u.role ?? '',
                verified: u.is_verified ? 'Yes' : 'No',
                joined: u.created_at ? new Date(u.created_at).toISOString() : '',
            }))
        if (rows.length === 0) return
        const headers = ['Name', 'Email', 'Phone', 'Role', 'Verified', 'Joined At']
        const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
        const csv = [headers.join(','), ...rows.map((r) => [r.name, r.email, r.phone, r.role, r.verified, r.joined].map(escape).join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `users-${reportYear}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/orders" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-900">USERS</h1>
            </div>

            <div className="flex gap-6">
                {/* Left Column */}
                <div className="w-[360px] space-y-4 shrink-0">
                    {/* User Details Card — shows whichever user is selected from the table below */}
                    <div className="rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-b from-[#E8E9FF] to-[#D4D6FF] p-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-gray-900 font-bold text-lg">User Details</h2>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Filter loaded users"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 w-44"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                                    <span className="text-3xl font-bold text-[#1a1a2e]">
                                        {selectedUser ? displayName(selectedUser).charAt(0).toUpperCase() : '—'}
                                    </span>
                                </div>
                                <div className="text-gray-700 text-sm space-y-1.5">
                                    <p><span className="font-semibold text-gray-900">Name:</span> {selectedUser ? displayName(selectedUser) : '—'}</p>
                                    <p><span className="font-semibold text-gray-900">Email:</span> {selectedUser?.email ?? '—'}</p>
                                    <p><span className="font-semibold text-gray-900">Tel. No:</span> {selectedUser?.phone_number ?? '—'}</p>
                                    <p><span className="font-semibold text-gray-900">Join Date:</span> {selectedUser?.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : '—'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#C8CAEE] px-4 py-3 flex items-center justify-between">
                            {/* No "last order date" field exists on the admin user object — omitted rather than faked */}
                            <span className="text-gray-800 text-sm font-medium">
                                {selectedUser ? `User ID: ${selectedUser.id}` : 'Select a user below'}
                            </span>
                            <Link
                                href={selectedUser ? `/admin/orders?user_id=${selectedUser.id}` : '#'}
                                className={`bg-[#4043FF] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#3333CC] transition-colors ${!selectedUser ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                View Orders
                            </Link>
                        </div>
                    </div>

                    {/* New Users This Month — real, derived from created_at */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">NEW USERS THIS MONTH</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{monthlyUsers}</span>
                        </div>

                        <div className="space-y-3">
                            {newUsers.length === 0 ? (
                                <p className="text-sm text-gray-500">No new users this month.</p>
                            ) : (
                                newUsers.slice(0, 5).map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-full border-2 border-[#4043FF] bg-white flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.joinedText}</p>
                                            </div>
                                        </div>
                                        <div className="text-right min-w-0">
                                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                            <p className="text-xs text-gray-500">{user.phone}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 space-y-4 min-w-0">
                    {/* Stats Cards Row */}
                    <div className="flex gap-4">
                        {/* Total User Card */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total User</p>
                                    <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <span className="text-xs text-gray-500">{plural(totalUsers, 'user')} registered</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#E8E9FF] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Monthly User Card */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Monthly User</p>
                                    <p className="text-3xl font-bold text-gray-900">{monthlyUsers}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <span className="text-xs text-gray-500">
                                            {now.toLocaleDateString(undefined, { month: 'long' })} {plural(monthlyUsers, 'signup')}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#E8E9FF] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Chart — per-month signups for the current year */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">User Chart</h3>
                        <div className="relative h-40">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400">
                                <span>{Math.max(...chartSeries.map((m) => m.count), 1)}</span>
                                <span>{Math.ceil(Math.max(...chartSeries.map((m) => m.count), 1) * 0.66)}</span>
                                <span>{Math.ceil(Math.max(...chartSeries.map((m) => m.count), 1) * 0.33)}</span>
                                <span>0</span>
                            </div>
                            {/* Chart area */}
                            <div className="ml-8 h-full relative">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between">
                                    <div className="border-t border-gray-100"></div>
                                    <div className="border-t border-gray-100"></div>
                                    <div className="border-t border-gray-100"></div>
                                    <div className="border-t border-gray-100"></div>
                                </div>
                                {/* Bar chart built from the monthly series */}
                                <div className="absolute inset-x-0 bottom-6 top-0 flex items-end justify-between px-1">
                                    {chartSeries.map((month) => (
                                        <div key={month.label} className="flex-1 flex flex-col items-center justify-end h-full">
                                            <div className="w-2.5 bg-[#4043FF] rounded-t transition-all" style={{ height: month.count === 0 ? '2px' : `${Math.max((month.count / Math.max(...chartSeries.map((m) => m.count), 1)) * 100, 4)}%`, opacity: month.count === 0 ? 0.2 : 1 }} />
                                        </div>
                                    ))}
                                </div>
                                {/* X-axis labels */}
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    {chartSeries.map((month) => (
                                        <span key={month.label}>{month.label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Reports Row */}
                    <div className="flex gap-4">
                        {/* User Reports */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">User Reports</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Select Year</p>
                            <div className="flex items-center gap-4 mb-3">
                                <label className="flex items-center gap-1.5">
                                    <input
                                        type="radio"
                                        name="reportYear"
                                        value="this_year"
                                        checked={selectedReportYear === 'this_year'}
                                        onChange={(e) => setSelectedReportYear(e.target.value)}
                                        className="w-3 h-3 text-[#4043FF]"
                                    />
                                    <span className="text-xs text-gray-600">This Year ({now.getFullYear()})</span>
                                </label>
                                <label className="flex items-center gap-1.5">
                                    <input
                                        type="radio"
                                        name="reportYear"
                                        value="last_year"
                                        checked={selectedReportYear === 'last_year'}
                                        onChange={(e) => setSelectedReportYear(e.target.value)}
                                        className="w-3 h-3 text-[#4043FF]"
                                    />
                                    <span className="text-xs text-gray-600">Last Year ({now.getFullYear() - 1})</span>
                                </label>
                                <label className="flex items-center gap-1.5">
                                    <input
                                        type="radio"
                                        name="reportYear"
                                        value="2_years_ago"
                                        checked={selectedReportYear === '2_years_ago'}
                                        onChange={(e) => setSelectedReportYear(e.target.value)}
                                        className="w-3 h-3 text-[#4043FF]"
                                    />
                                    <span className="text-xs text-gray-600">2 Years Ago ({now.getFullYear() - 2})</span>
                                </label>
                            </div>
                            <button onClick={exportCsv} className="bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                Download User Reports (CSV)
                            </button>
                        </div>

                        {/* Active Users */}
                        <div className="w-40 bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Active Users</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">{activeUsers}</span>
                                <span className="text-xs text-green-500 font-semibold">
                                    {totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}%` : '0%'}
                                </span>
                            </div>
                            {/* Mini bar showing the verified share */}
                            <div className="w-full h-2 mt-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#4043FF] rounded-full transition-all" style={{ width: totalUsers > 0 ? `${(activeUsers / totalUsers) * 100}%` : '0%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users List Table */}
            <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Users List</h3>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
                    </div>
                ) : error ? (
                    <p className="text-center text-gray-500 py-8">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                        <table className="w-full min-w-[480px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left text-sm font-bold text-gray-900 pb-3 pl-4">Name</th>
                                    <th className="text-center text-sm font-bold text-gray-900 pb-3">Email</th>
                                    <th className="text-right text-sm font-bold text-gray-900 pb-3 pr-4">Tel. No</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center text-gray-500 py-8">No users found.</td>
                                    </tr>
                                ) : visibleUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-[#E8E9FF]/40' : ''}`}
                                    >
                                        <td className="text-left text-sm text-gray-700 py-3 pl-4">{displayName(user)}</td>
                                        <td className="text-center text-sm text-gray-700 py-3">{user.email}</td>
                                        <td className="text-right text-sm text-gray-700 py-3 pr-4">{user.phone_number ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>

                        {/* Pagination — real, driven by totalPages from the API */}
                        <div className="flex items-center justify-end gap-2 mt-4">
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
                    </>
                )}
            </div>
        </div>
    )
}