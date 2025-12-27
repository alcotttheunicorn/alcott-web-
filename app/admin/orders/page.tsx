'use client'

import Link from 'next/link'
import { useState } from 'react'

type OrderStatus = 'all' | 'initiated' | 'pending' | 'on_process' | 'delivered' | 'canceled'

interface Order {
    id: string
    orderId: string | null
    createdAt: string
    createdBy: string
    status: Exclude<OrderStatus, 'all'>
}

// Mock data
const mockOrders: Order[] = [
    {
        id: '1',
        orderId: null,
        createdAt: '12:47 pm, 04-09-25',
        createdBy: 'Ikechukwu Dave',
        status: 'pending',
    },
    {
        id: '2',
        orderId: '1679-345898-2367',
        createdAt: '12:00 pm, 14-09-25',
        createdBy: 'Ikechukwu Dave',
        status: 'canceled',
    },
    {
        id: '3',
        orderId: '1622-244898-2365',
        createdAt: '12:47 pm, 04-09-25',
        createdBy: 'Ikechukwu Dave',
        status: 'on_process',
    },
    {
        id: '4',
        orderId: '1244-244898-2595',
        createdAt: '12:47 pm, 04-09-25',
        createdBy: 'Ikechukwu Dave',
        status: 'initiated',
    },
    {
        id: '5',
        orderId: '1644-299456-2075',
        createdAt: '12:47 pm, 04-09-25',
        createdBy: 'Ikechukwu Dave',
        status: 'delivered',
    },
]

const statusTabs: { key: OrderStatus; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'initiated', label: 'INITIATED' },
    { key: 'pending', label: 'PENDING' },
    { key: 'on_process', label: 'ON PROCESS' },
    { key: 'delivered', label: 'DELIVERED' },
    { key: 'canceled', label: 'CANCELED' },
]

function OrderStatusIcon({ status, hasOrderId }: { status: Order['status']; hasOrderId: boolean }) {
    // Gray clipboard - no order ID yet
    if (!hasOrderId) {
        return (
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
        )
    }

    switch (status) {
        case 'canceled':
            // Red X - cancelled order
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            )
        case 'on_process':
            // Green truck - created order (in transit)
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                </div>
            )
        case 'initiated':
            // Purple box - created but not shipped
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
            )
        case 'delivered':
            // Green checkmark for delivered
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )
        default:
            // Default gray clipboard
            return (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            )
    }
}

export default function AdminOrdersPage() {
    const [activeTab, setActiveTab] = useState<OrderStatus>('all')

    const filteredOrders = mockOrders.filter((order) => {
        if (activeTab === 'all') return true
        return order.status === activeTab
    })

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
                {filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow"
                    >
                        {/* Left: Icon and Order Info */}
                        <div className="flex items-center gap-3 lg:gap-4">
                            <OrderStatusIcon status={order.status} hasOrderId={!!order.orderId} />
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">
                                    {order.orderId || 'No order id yet'}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Created: {order.createdAt}
                                </p>
                                <p className="text-xs text-gray-500">
                                    By: {order.createdBy}
                                </p>
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

                {filteredOrders.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 lg:p-12 text-center">
                        <p className="text-gray-500">No orders found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
