'use client'

import type { AdminUser } from '@/lib/api/admin-api'

interface NewUsersMonthCardProps {
    users: AdminUser[]
    getDisplayName: (user: AdminUser) => string
}

function formatJoinedText(createdAt?: string): string {
    if (!createdAt) return 'Recently joined'
    const created = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Joined Today'
    if (diffDays === 1) return 'Joined Yesterday'
    if (diffDays < 7) return `Joined ${diffDays} days ago`
    return `Joined ${created.toLocaleDateString()}`
}

export function NewUsersMonthCard({ users, getDisplayName }: NewUsersMonthCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-900">NEW USERS THIS MONTH</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{users.length}</span>
            </div>

            <div className="space-y-3">
                {users.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">No new users this month yet.</p>
                ) : users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full border-2 border-[#4043FF] bg-white flex items-center justify-center">
                                <span className="text-sm font-bold text-[#4043FF]">
                                    {getDisplayName(user).charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{getDisplayName(user)}</p>
                                <p className="text-xs text-gray-500">{formatJoinedText(user.created_at)}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-600 truncate max-w-[110px]">{user.email}</p>
                            <p className="text-xs text-gray-500">{user.phone_number ?? '—'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
