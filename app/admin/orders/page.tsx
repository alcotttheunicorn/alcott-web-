'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAdminShipments } from '@/hooks/use-admin'
import { EmptyState } from '@/components/shared/EmptyState'
import { AdminOrderListSkeleton } from '@/components/shared/skeletons'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { OrderStatusIcon } from '@/components/admin/OrderStatusIcon'
import { StatusFilterTabs } from '@/components/admin/StatusFilterTabs'
import Link from 'next/link'

type OrderStatus = 'all' | 'pending' | 'on_process' | 'delivered'

const statusToApiValue: Record<Exclude<OrderStatus, 'all'>, string> = {
    pending: 'PENDING',
    on_process: 'ON_PROCESS',
    delivered: 'DELIVERED',
}

function mapShipmentStatus(status: string): Exclude<OrderStatus, 'all'> {
    if (status === 'ON_PROCESS' || status === 'ONGOING') return 'on_process'
    if (status === 'DELIVERED') return 'delivered'
    if (status === 'SUBMITTED' || status === 'UNPAID') return 'pending'
    return 'pending'
}

function AdminOrdersContent() {
    const searchParams = useSearchParams()
    const userIdFilter = searchParams.get('user_id')
    const [activeTab, setActiveTab] = useState<OrderStatus>('all')

    const status = activeTab === 'all' ? undefined : statusToApiValue[activeTab]

    const { data: orders = [], isLoading: loading, error: queryError } = useAdminShipments({
        status,
        user_id: userIdFilter ?? undefined,
        limit: 50,
    })

    const error = queryError
        ? ((queryError as any)?.response?.status === 403
            ? "You don't have admin access to view shipments."
            : 'Could not load orders.')
        : ''

    return (
        <div className="p-4 lg:p-6">
            <AdminPageHeader title="ORDERS" backHref="/home">
                {userIdFilter && (
                    <span className="ml-auto flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                        Filtered by user: {userIdFilter}
                        <Link href="/admin/orders" className="text-[#4043FF] hover:underline">Clear</Link>
                    </span>
                )}
            </AdminPageHeader>

            <StatusFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="space-y-3 lg:space-y-4">
                {loading ? (
                    <AdminOrderListSkeleton />
                ) : error ? (
                    <EmptyState message={error} />
                ) : orders.length === 0 ? (
                    <EmptyState message="No orders found for this filter." />
                ) : orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow"
                    >
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
        <Suspense fallback={<AdminOrderListSkeleton />}>
            <AdminOrdersContent />
        </Suspense>
    )
}
