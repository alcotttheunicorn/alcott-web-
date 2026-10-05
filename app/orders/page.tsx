'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { useShipments } from '@/hooks/use-shipments'
import type { ShipmentData } from '@/lib/api/types'

type OrderStatus = 'all' | 'pending' | 'onprocess' | 'delivered'

interface Order {
  id: string
  trackingNumber: string
  status: OrderStatus
  statusText: string
  statusLabel: string
  statusColor: string
  raw: ShipmentData
}

function normalizeShipmentStatus(status?: string) {
  return String(status ?? '').trim().toUpperCase()
}

function mapShipmentToOrder(s: ShipmentData): Order {
  const statusKey = normalizeShipmentStatus(s.status)
  const statusMap: Record<string, { status: OrderStatus; text: string; label: string; color: string }> = {
    UNPAID: { status: 'pending', text: 'Awaiting payment', label: 'Unpaid', color: 'bg-gray-100 text-gray-700' },
    PAYMENT_PENDING: { status: 'pending', text: 'Awaiting payment', label: 'Unpaid', color: 'bg-gray-100 text-gray-700' },
    SUBMITTED: { status: 'pending', text: 'Awaiting pickup', label: 'Submitted', color: 'bg-yellow-100 text-yellow-700' },
    PENDING: { status: 'pending', text: 'Awaiting pickup', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    PICKUP_SCHEDULED: { status: 'pending', text: 'Pickup scheduled', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    ON_PROCESS: { status: 'onprocess', text: 'On transit', label: 'On Process', color: 'bg-[#4043FF] text-white' },
    IN_TRANSIT: { status: 'onprocess', text: 'On transit', label: 'On Process', color: 'bg-[#4043FF] text-white' },
    SHIPPED: { status: 'onprocess', text: 'On transit', label: 'Shipped', color: 'bg-[#4043FF] text-white' },
    DELIVERED: { status: 'delivered', text: 'Package received', label: 'Completed', color: 'bg-green-100 text-green-700' },
    COMPLETED: { status: 'delivered', text: 'Package received', label: 'Completed', color: 'bg-green-100 text-green-700' },
  }

  const mapped = statusMap[statusKey] ?? {
    status: statusKey === 'DELIVERED' || statusKey === 'COMPLETED' ? 'delivered' : 'pending',
    text: s.status || 'Processing',
    label: s.status || 'Pending',
    color: 'bg-gray-100 text-gray-600',
  }

  return {
    id: s.id,
    trackingNumber: s.tracking_id || '—',
    status: mapped.status,
    statusText: mapped.text,
    statusLabel: mapped.label,
    statusColor: mapped.color,
    raw: s,
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all')
  const { data: shipmentData = [], isLoading: loading } = useShipments({ limit: 100 })

  const orders = shipmentData.map(mapShipmentToOrder)
  const visibleOrders = activeStatus === 'all' ? orders : orders.filter((order) => order.status === activeStatus)

  return (
    <UserAppLayout activeNav="orders">
      <div className="mx-auto w-full max-w-8xl px-4 py-4 lg:px-6 lg:py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Orders</h1>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          {(['all', 'pending', 'onprocess', 'delivered'] as OrderStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 sm:px-6 py-2.5 rounded-full font-semibold text-sm transition-colors whitespace-nowrap ${
                activeStatus === status
                  ? 'bg-[#4043FF] text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:border-[#4043FF] hover:text-[#4043FF]'
              }`}

            >
              {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : status === 'onprocess' ? 'On Process' : 'Delivered'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]"></div>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            visibleOrders.map((order, index) => (
              <div
                key={order.id}
                onClick={() => router.push(`/orders/${order.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E8E9FF] shrink-0">
                      {order.status === 'onprocess' ? (
                        <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {order.trackingNumber}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {order.statusText}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${order.statusColor}`}>
                      {order.statusLabel}
                    </span>
                  </div>
                </div>

                {index === 0 && (
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/search?q=${encodeURIComponent(order.trackingNumber)}`)
                      }}
                      className="w-full bg-[#4043FF] text-white py-3 rounded-lg font-semibold hover:bg-[#3333CC] transition-colors"

                    >
                      Track
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </UserAppLayout>
  )
}
