'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { getAdminUsers, type AdminUser } from '@/lib/api/admin-api'
import { StatCard } from '@/components/admin/StatCard'
import { UserDetailsCard } from '@/components/admin/UserDetailsCard'
import { UsersTable } from '@/components/admin/UsersTable'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { NewUsersMonthCard } from '@/components/admin/NewUsersMonthCard'
import { UserChart } from '@/components/admin/UserChart'
import { UserReportsCard } from '@/components/admin/UserReportsCard'
import { StatCardsSkeleton } from '@/components/shared/skeletons'

const PAGE_SIZE = 10

function displayName(user: AdminUser) {
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
    return name || user.email
}

export default function UsersPage() {
    const { token, isLoading: authLoading } = useAuth()
    const [searchValue, setSearchValue] = useState('')
    const [selectedReportYear, setSelectedReportYear] = useState('last_year')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

    const { data, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['admin-users', token, currentPage],
        queryFn: () => getAdminUsers({ page: currentPage, limit: PAGE_SIZE }),
        enabled: !authLoading && !!token,
    })

    const users = data?.data?.users && Array.isArray(data.data.users) ? data.data.users : []
    const totalItems = data?.totalItems ?? null
    const totalPages = data?.totalPages || 1

    const now = new Date()
    const newUsersThisMonth = users.filter((u) => {
        if (!u.created_at) return false
        const d = new Date(u.created_at)
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
    const monthlyCount = newUsersThisMonth.length
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

    useEffect(() => {
        if (!selectedUser && users.length > 0) setSelectedUser(users[0])
    }, [users])

    const visibleUsers = searchValue.trim()
        ? users.filter((u) =>
            displayName(u).toLowerCase().includes(searchValue.trim().toLowerCase()) ||
            u.email?.toLowerCase().includes(searchValue.trim().toLowerCase())
        )
        : users

    return (
        <div className="p-6">
            <AdminPageHeader title="USERS" backHref="/admin/orders" />

            <div className="flex gap-6 flex-col lg:flex-row">
                <div className="w-full lg:w-[360px] space-y-4">
                    <UserDetailsCard
                        selectedUser={selectedUser}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        getDisplayName={displayName}
                    />
                    <NewUsersMonthCard users={newUsersThisMonth} getDisplayName={displayName} />
                </div>

                <div className="flex-1 space-y-4">
                    {loading ? <StatCardsSkeleton /> : (
                      <>
                    <div className="flex gap-4">
                        <StatCard
                            title="Total User"
                            value={totalItems !== null ? totalItems.toLocaleString() : '—'}
                            trendLabel="All time"
                            icon={
                                <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Monthly User"
                            value={monthlyCount}
                            trendLabel={now.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            icon={
                                <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        />
                    </div>

                    <UserChart />

                    <div className="flex gap-4">
                        <UserReportsCard selectedYear={selectedReportYear} onYearChange={setSelectedReportYear} />
                        <div className="w-40 bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Active Users</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">13</span>
                                <span className="text-xs text-green-500 font-semibold">+20%</span>
                            </div>
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
                      </>
                    )}
                </div>
            </div>

            <UsersTable
                loading={loading}
                error={error}
                visibleUsers={visibleUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                getDisplayName={displayName}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </div>
    )
}
