'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { OrderDetailSkeleton } from '@/components/shared/skeletons'
import { useShipmentById, usePayShipment } from '@/hooks/use-shipments'
import { UserAppLayout } from '@/components/layout/UserAppLayout'

const STATUS_STYLES: Record<string, string> = {
  UNPAID: 'bg-yellow-100 text-yellow-700',
  ON_PROCESS: 'bg-[#4043FF] text-white',
  DELIVERED: 'bg-green-100 text-green-700',
}

export default function OrderDetailPage() {
  return (
    <UserAppLayout activeNav="orders" headerTitle={{ title: 'Order Details' }}>
      <OrderDetailContent />
    </UserAppLayout>
  )
}

function OrderDetailContent() {
  const { id } = useParams<{ id: string }>()
  const { data: shipment, isLoading: loading, error: queryError } = useShipmentById(id)
  const payMutation = usePayShipment()

  const error = queryError
    ? ((queryError as any)?.response?.status === 404 ? 'Order not found.' : 'Could not load this order.')
    : ''

  const handlePay = () => {
    if (!id) return
    payMutation.mutate({
      id,
      payload: { payment_method: 'WALLET', currency: 'NGN' },
    })
  }

  return (
    <div className="max-w-8xl mx-auto p-4 lg:p-6">
      {loading ? (
        <OrderDetailSkeleton />
      ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4" style={{ fontFamily: "'Urbanist', sans-serif" }}>{error}</p>
            <Link href="/orders" className="text-[#4043FF] font-semibold">Back to Orders</Link>
          </div>
        ) : shipment ? (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Urbanist', sans-serif" }}>Tracking ID</p>
                <p className="text-lg font-bold text-gray-900 truncate" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  {shipment.tracking_id}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 ${STATUS_STYLES[shipment.status] ?? 'bg-gray-100 text-gray-600'}`}
                style={{ fontFamily: "'Urbanist', sans-serif" }}
              >
                {shipment.status}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: "'Urbanist', sans-serif" }}>Sender</h2>
              <dl className="space-y-1 text-sm text-gray-600" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                <div className="flex justify-between"><dt>Name</dt><dd className="text-gray-900">{shipment.sender_name}</dd></div>
                <div className="flex justify-between"><dt>Phone</dt><dd className="text-gray-900">{shipment.sender_phone_number}</dd></div>
                <div className="flex justify-between"><dt>City</dt><dd className="text-gray-900">{shipment.sender_city}</dd></div>
                <div className="flex justify-between gap-4"><dt className="shrink-0">Address</dt><dd className="text-gray-900 text-right min-w-0 break-words">{shipment.sender_address}</dd></div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: "'Urbanist', sans-serif" }}>Receiver</h2>
              <dl className="space-y-1 text-sm text-gray-600" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                <div className="flex justify-between"><dt>Name</dt><dd className="text-gray-900">{shipment.receiver_name}</dd></div>
                <div className="flex justify-between"><dt>Phone</dt><dd className="text-gray-900">{shipment.receiver_phone_number}</dd></div>
                <div className="flex justify-between"><dt>City</dt><dd className="text-gray-900">{shipment.receiver_city}</dd></div>
                <div className="flex justify-between gap-4"><dt className="shrink-0">Address</dt><dd className="text-gray-900 text-right min-w-0 break-words">{shipment.receiver_address}</dd></div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: "'Urbanist', sans-serif" }}>Package</h2>
              <dl className="space-y-1 text-sm text-gray-600" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                <div className="flex justify-between"><dt>Category</dt><dd className="text-gray-900">{shipment.package_category ?? '—'}</dd></div>
                <div className="flex justify-between"><dt>Weight</dt><dd className="text-gray-900">{shipment.package_weight ? `${shipment.package_weight} kg` : '—'}</dd></div>
                <div className="flex justify-between"><dt>Dimensions</dt><dd className="text-gray-900">
                  {shipment.package_length && shipment.package_width && shipment.package_height
                    ? `${shipment.package_length} × ${shipment.package_width} × ${shipment.package_height} cm`
                    : '—'}
                </dd></div>
                <div className="flex justify-between"><dt>Payment method</dt><dd className="text-gray-900">{shipment.payment_method ?? '—'}</dd></div>
                {shipment.price != null && (
                  <div className="flex justify-between"><dt>Price</dt><dd className="text-gray-900">₦{Number(shipment.price).toLocaleString()}</dd></div>
                )}
                {shipment.created_at && (
                  <div className="flex justify-between"><dt>Created</dt><dd className="text-gray-900">{new Date(shipment.created_at).toLocaleDateString()}</dd></div>
                )}
              </dl>
            </div>

            {shipment.status === 'UNPAID' && (
              <button
                type="button"
                onClick={handlePay}
                disabled={payMutation.isPending}
                className="w-full rounded-xl bg-[#4043FF] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {payMutation.isPending ? 'Processing payment...' : 'Pay shipment'}
              </button>
            )}
          </div>
        ) : null}
    </div>
  )
}