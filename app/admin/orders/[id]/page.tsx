'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { OrderInfoBar } from '@/components/admin/OrderInfoBar'
import { DetailInfoCard } from '@/components/admin/DetailInfoCard'
import { ActionsCard } from '@/components/admin/ActionsCard'
import { DeliveryInfoCard } from '@/components/admin/DeliveryInfoCard'
import { EventLogCard } from '@/components/admin/EventLogCard'
import { FinanceCard } from '@/components/admin/FinanceCard'
import { mockOrderDetails } from '@/lib/admin-orders-data'

export default function OrderDetailsPage() {
    const params = useParams()
    const orderId = params.id as string
    const order = mockOrderDetails[orderId]

    if (!order) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
                    <Link href="/admin/orders" className="text-[#4043FF] hover:underline">
                        Back to Orders
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <AdminPageHeader title="ORDERS DETAILS" backHref="/admin/orders">
                <button className="text-[#4043FF] text-sm font-semibold flex items-center gap-1 hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    EDIT
                </button>
            </AdminPageHeader>

            <div className="flex gap-6">
                <div className="flex-1 space-y-6">
                    <OrderInfoBar
                        charge={order.charge}
                        currency={order.currency}
                        orderId={order.orderId}
                        status={order.status}
                        submittedAt={order.submittedAt}
                        processingStart={order.processingStart}
                        processingEnd={order.processingEnd}
                    />
                    <DetailInfoCard title="Sender" fields={[
                        { label: 'Sender name', value: order.sender.name },
                        { label: 'Sender Phone', value: order.sender.phone },
                        { label: 'Sender email', value: order.sender.email },
                        { label: 'Sender Address', value: order.sender.address },
                    ]} />
                    <DetailInfoCard title="Receiver" fields={[
                        { label: 'Receiver name', value: order.receiver.name },
                        { label: 'Receiver email', value: order.receiver.email },
                        { label: 'Receiver Phone', value: order.receiver.phone },
                        { label: 'Receiver Address', value: order.receiver.address },
                    ]} />
                    <DetailInfoCard title="Rider" fields={[
                        { label: 'Rider name', value: order.rider.name },
                        { label: 'Rider vehicle', value: order.rider.vehicle },
                        { label: 'Rider Phone', value: order.rider.phone },
                        { label: 'Vehicle info', value: order.rider.vehicleInfo },
                    ]} />
                    <DetailInfoCard title="Package" fields={[
                        { label: 'Package description', value: order.package.description },
                        { label: 'Packaging method', value: order.package.method },
                        { label: 'Package Weight', value: order.package.weight },
                        { label: 'Package priority', value: order.package.priority },
                    ]} />
                </div>

                <div className="w-80 space-y-6">
                    <ActionsCard />
                    <DeliveryInfoCard estDays={order.delivery.estDays} estDate={order.delivery.estDate} />
                    <EventLogCard events={order.eventLog} />
                    <FinanceCard
                        amountPaid={order.finance.amountPaid}
                        paymentMethod={order.finance.paymentMethod}
                        paymentStatus={order.finance.paymentStatus}
                        expenses={order.finance.expenses}
                        profit={order.finance.profit}
                        currency={order.currency}
                    />
                </div>
            </div>
        </div>
    )
}
