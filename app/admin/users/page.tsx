'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useAdminUsers } from '@/hooks/use-admin'
import type { AdminUser } from '@/lib/api/admin-api'

const PAGE_SIZE = 10

function displayName(user: AdminUser) {
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
    return name || user.email
}

// Still hardcoded — there's no endpoint for "new users this month" specifically.
// Left in place rather than deleted since it was already part of the shipped UI;
// needs a real /admin/users?created_after= filter or equivalent before it can be wired.
const mockNewUsers = [
    { id: '1', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
    { id: '2', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
    { id: '3', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
    { id: '4', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
    { id: '5', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
]

export default function UsersPage() {
    const { token, isLoading: authLoading } = useAuth()
    const [searchValue, setSearchValue] = useState('')
    const [selectedReportYear, setSelectedReportYear] = useState('last_year')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

    const { data, isLoading: queryLoading, error: queryError } = useAdminUsers({ page: currentPage, limit: PAGE_SIZE })

    const users = data && Array.isArray(data.data) ? data.data : []
    const totalPages = data?.totalPages || 1
    // authLoading itself counts as "loading" so the page shows a spinner
    // instead of flashing the "not signed in" error during the brief window
    // before useAuth resolves.
    const loading = authLoading || queryLoading
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
                <div className="w-[360px] space-y-4">
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

                    {/* New Users This Month — still mock, see note on mockNewUsers above */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">NEW USERS THIS MONTH</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{mockNewUsers.length}</span>
                        </div>

                        <div className="space-y-3">
                            {mockNewUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full border-2 border-[#4043FF] bg-white flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.joinedText}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-600">{user.email}</p>
                                        <p className="text-xs text-gray-500">{user.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/*
                      "New Users This Month" list above, and everything in the Right Column
                      below (Total User, Monthly User, User Chart, User Reports, Active Users,
                      CSV export) are still hardcoded. There's no /admin analytics or CSV-export
                      endpoint documented anywhere in the API docs shared so far — needs backend
                      support before any of this can be wired to real numbers.
                    */}
                </div>

                {/* Right Column */}
                <div className="flex-1 space-y-4">
                    {/* Stats Cards Row */}
                    <div className="flex gap-4">
                        {/* Total User Card */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total User</p>
                                    <p className="text-3xl font-bold text-gray-900">800</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7 14l5-5 5 5z" />
                                        </svg>
                                        <span className="text-xs text-green-500 font-semibold">8.5%</span>
                                        <span className="text-xs text-gray-500">This Year</span>
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
                                    <p className="text-3xl font-bold text-gray-900">10</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7 14l5-5 5 5z" />
                                        </svg>
                                        <span className="text-xs text-green-500 font-semibold">2.5%</span>
                                        <select className="text-xs text-gray-500 bg-transparent border-none p-0 focus:ring-0">
                                            <option>This Month</option>
                                        </select>
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

                    {/* User Chart */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">User Chart</h3>
                        <div className="relative h-40">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400">
                                <span>80</span>
                                <span>60</span>
                                <span>40</span>
                                <span>20</span>
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
                                    <div className="border-t border-gray-100"></div>
                                </div>
                                {/* Line chart SVG */}
                                <svg className="w-full h-[calc(100%-24px)]" viewBox="0 0 300 100" preserveAspectRatio="none">
                                    <polyline
                                        fill="none"
                                        stroke="#4043FF"
                                        strokeWidth="2"
                                        points="0,80 50,60 100,70 150,30 200,50 250,20 300,40"
                                    />
                                </svg>
                                {/* X-axis labels */}
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>Mar</span>
                                    <span>Apr</span>
                                    <span>May</span>
                                    <span>Jun</span>
                                    <span>Jul</span>
                                    <span>Aug</span>
                                    <span>Sept</span>
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
                                    <span className="text-xs text-gray-600">This Year</span>
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
                                    <span className="text-xs text-gray-600">Last Year</span>
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
                                    <span className="text-xs text-gray-600">2 Years Ago</span>
                                </label>
                            </div>
                            <button className="bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                Download User Reports (CSV)
                            </button>
                        </div>

                        {/* Active Users */}
                        <div className="w-40 bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Active Users</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">13</span>
                                <span className="text-xs text-green-500 font-semibold">+20%</span>
                            </div>
                            {/* Mini chart */}
                            <svg className="w-full h-8 mt-2" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <polyline
                                    fill="none"
                                    stroke="#EF4444"
                                    strokeWidth="2"
                                    points="0,25 20,20 40,15 60,18 80,10 100,5"
                                />
                            </svg>
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
                        <table className="w-full">
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