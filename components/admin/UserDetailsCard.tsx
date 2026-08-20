import React from 'react'
import Link from 'next/link'
import { type AdminUser } from '@/lib/api/admin-api'

interface UserDetailsCardProps {
    selectedUser: AdminUser | null;
    searchValue: string;
    setSearchValue: (val: string) => void;
    getDisplayName: (user: AdminUser) => string;
}

export function UserDetailsCard({
    selectedUser,
    searchValue,
    setSearchValue,
    getDisplayName,
}: UserDetailsCardProps) {
    return (
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
                            {selectedUser ? getDisplayName(selectedUser).charAt(0).toUpperCase() : '—'}
                        </span>
                    </div>
                    <div className="text-gray-700 text-sm space-y-1.5">
                        <p><span className="font-semibold text-gray-900">Name:</span> {selectedUser ? getDisplayName(selectedUser) : '—'}</p>
                        <p><span className="font-semibold text-gray-900">Email:</span> {selectedUser?.email ?? '—'}</p>
                        <p><span className="font-semibold text-gray-900">Tel. No:</span> {selectedUser?.phone_number ?? '—'}</p>
                        <p><span className="font-semibold text-gray-900">Join Date:</span> {selectedUser?.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : '—'}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#C8CAEE] px-4 py-3 flex items-center justify-between">
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
    )
}
