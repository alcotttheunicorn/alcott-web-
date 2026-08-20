'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { PageHeading, StatusTabs } from '@/components/user/page-primitives'
import { OrderListSkeleton } from '@/components/shared/skeletons'
import { useAuth } from '@/hooks/use-auth'
import { getShipments } from '@/lib/api/shipment-api'
import type { ShipmentData } from '@/lib/api/types'

type OrderStatus = 'all' | 'pending' | 'onprocess' | 'delivered'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'onprocess', label: 'On Process' },
  { value: 'delivered', label: 'Delivered' },
] as const

const STATUS_DETAILS: Record<string, Omit<Order, 'id' | 'trackingNumber'>> = {
  PENDING: { status: 'pending', statusText: 'Awaiting pickup', statusLabel: 'Pending', statusColor: 'bg-yellow-100 text-yellow-700' },
  ONGOING: { status: 'onprocess', statusText: 'On transit', statusLabel: 'On Process', statusColor: 'bg-[#4043FF] text-white' },
  DELIVERED: { status: 'delivered', statusText: 'Package received', statusLabel: 'Completed', statusColor: 'bg-green-100 text-green-700' },
}

interface Order {
  id: string
  trackingNumber: string
  status: OrderStatus
  statusText: string
  statusLabel: string
  statusColor: string
}

function mapShipmentToOrder(shipment: ShipmentData): Order {
  const details = STATUS_DETAILS[shipment.status] ?? {
    status: 'pending' as const,
    statusText: shipment.status,
    statusLabel: shipment.status,
    statusColor: 'bg-gray-100 text-gray-600',
  }
  return { id: shipment.id, trackingNumber: shipment.tracking_id, ...details }
}

function OrderCard({ order, showTrackAction }: { order: Order; showTrackAction: boolean }) {
  const router = useRouter()
  const Icon = order.status === 'onprocess' ? Truck : Package
  const openOrder = () => router.push(`/orders/${order.id}`)

  return (
    <article onClick={openOrder} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E8E9FF]">
            <Icon className="w-6 h-6 text-[#4043FF]" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{order.trackingNumber}</h3>
            <p className="text-sm text-gray-500">{order.statusText}</p>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${order.statusColor}`}>{order.statusLabel}</span>
      </div>
      {showTrackAction && (
        <button onClick={(event) => { event.stopPropagation(); openOrder() }} className="mt-4 w-full bg-[#4043FF] text-white py-3 rounded-lg font-semibold hover:bg-[#3333CC] transition-colors">
          Track
        </button>
      )}
    </article>
  )
}

export default function OrdersPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all')
  const statusParam = activeStatus === 'all' ? undefined : activeStatus === 'onprocess' ? 'ONGOING' : activeStatus.toUpperCase()
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['shipments', token, statusParam],
    queryFn: () => getShipments({ status: statusParam, limit: 20 }).then((response) => (Array.isArray(response.data) ? response.data : []).map(mapShipmentToOrder)),
    enabled: Boolean(token),
  })

  return (
    <UserAppLayout activeNav="orders" contentBgClass="bg-white">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <PageHeading title="Orders" onBack={() => router.back()} />
        <StatusTabs options={STATUS_OPTIONS} value={activeStatus} onChange={setActiveStatus} />
        <div className="space-y-4">
          {isLoading ? <OrderListSkeleton />
            : orders.length === 0 ? <p className="text-center py-12 text-gray-500">No orders found</p>
            : orders.map((order, index) => <OrderCard key={order.id} order={order} showTrackAction={index === 0} />)}
        </div>
      </div>
    </UserAppLayout>
  )
}
