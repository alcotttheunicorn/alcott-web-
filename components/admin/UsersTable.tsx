import React from 'react'
import { type AdminUser } from '@/lib/api/admin-api'
import { AdminUsersTableSkeleton } from '@/components/shared/skeletons'

interface UsersTableProps {
    loading: boolean;
    error: string;
    visibleUsers: AdminUser[];
    selectedUser: AdminUser | null;
    setSelectedUser: (user: AdminUser) => void;
    getDisplayName: (user: AdminUser) => string;
    currentPage: number;
    setCurrentPage: (page: number | ((p: number) => number)) => void;
    totalPages: number;
}

export function UsersTable({
    loading,
    error,
    visibleUsers,
    selectedUser,
    setSelectedUser,
    getDisplayName,
    currentPage,
    setCurrentPage,
    totalPages,
}: UsersTableProps) {
    return (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Users List</h3>

            {loading ? (
                <AdminUsersTableSkeleton />
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
                                    <td className="text-left text-sm text-gray-700 py-3 pl-4">{getDisplayName(user)}</td>
                                    <td className="text-center text-sm text-gray-700 py-3">{user.email}</td>
                                    <td className="text-right text-sm text-gray-700 py-3 pr-4">{user.phone_number ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
    )
}
