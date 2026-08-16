'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { getAdminShipments } from '@/lib/api/admin-api'
import type { ShipmentData } from '@/lib/api/types'

type OrderStatus = 'all' | 'pending' | 'on_process' | 'delivered' | 'canceled'

const statusToApiValue: Record<Exclude<OrderStatus, 'all'>, string> = {
    pending: 'PENDING',
    on_process: 'ONGOING',
    delivered: 'DELIVERED',
    canceled: 'CANCELED'
}

function mapShipmentStatus(status: string): Exclude<OrderStatus, 'all'> {
    if (status === 'ONGOING') return 'on_process'
    if (status === 'DELIVERED') return 'delivered'
    if (status === 'CANCELED') return 'canceled'
    return 'pending'
}

const statusTabs: { key: OrderStatus; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'pending', label: 'PENDING' },
    { key: 'on_process', label: 'ON PROCESS' },
    { key: 'delivered', label: 'DELIVERED' },
    { key: 'canceled', label: 'CANCELED'}
]

function OrderStatusIcon({ status }: { status: Exclude<OrderStatus, 'all'> }) {
    switch (status) {
        case 'on_process':
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                </div>
            )
        case 'delivered':
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )
        case 'canceled':
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )    
        default:
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            )
    }
}

function AdminOrdersContent() {
    const { token } = useAuth()
    const searchParams = useSearchParams()
    const userIdFilter = searchParams.get('user_id')
    const [activeTab, setActiveTab] = useState<OrderStatus>('all')
    const [orders, setOrders] = useState<ShipmentData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) return
        setLoading(true)
        setError('')
        const status = activeTab === 'all' ? undefined : statusToApiValue[activeTab]
        getAdminShipments(token, { status, user_id: userIdFilter ?? undefined, limit: 50 })
            .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
            .catch((err) => {
                setOrders([])
                setError(
                    err?.response?.status === 403
                        ? "You don't have admin access to view shipments."
                        : 'Could not load orders.'
                )
            })
            .finally(() => setLoading(false))
    }, [token, activeTab, userIdFilter])

    return (
        <div className="p-4 lg:p-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <Link href="/home" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">ORDERS</h1>
                {userIdFilter && (
                    <span className="ml-auto flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                        Filtered by user: {userIdFilter}
                        <Link href="/admin/orders" className="text-[#4043FF] hover:underline">Clear</Link>
                    </span>
                )}
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 lg:gap-3 mb-4 lg:mb-6">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-semibold text-xs lg:text-sm transition-colors whitespace-nowrap ${activeTab === tab.key
                            ? 'bg-[#4043FF] text-white'
                            : 'bg-white border border-gray-300 text-gray-600 hover:border-[#4043FF] hover:text-[#4043FF]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-3 lg:space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
                    </div>
                ) : error ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 lg:p-12 text-center">
                        <p className="text-gray-500">{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 lg:p-12 text-center">
                        <p className="text-gray-500">No orders found for this filter.</p>
                    </div>
                ) : orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow"
                    >
                        {/* Left: Icon and Order Info */}
                        <div className="flex items-center gap-3 lg:gap-4">
                            <OrderStatusIcon status={mapShipmentStatus(order.status)} />
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">
                                    {order.tracking_id || 'No tracking id yet'}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {order.receiver_name ? `To: ${order.receiver_name}` : ''}
                                </p>
                                {order.created_at && (
                                    <p className="text-xs text-gray-500">
                                        Created: {new Date(order.created_at).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right: Manage Button */}
                        <Link
                            href={`/admin/orders/${order.id}`}
                            className="px-4 lg:px-5 py-2 bg-[#4043FF] text-white text-sm font-semibold rounded-lg hover:bg-[#3333CC] transition-colors text-center sm:w-auto w-full"
                        >
                            MANAGE
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function AdminOrdersPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
            </div>
        }>
            <AdminOrdersContent />
        </Suspense>
    )
}