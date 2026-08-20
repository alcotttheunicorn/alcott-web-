'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { AuthGuard } from '@/components/auth-guard'
import { OrderDetailSkeleton } from '@/components/shared/skeletons'
import { useAuth } from '@/hooks/use-auth'
import { getShipmentById } from '@/lib/api/shipment-api'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ONGOING: 'bg-[#4043FF] text-white',
  DELIVERED: 'bg-green-100 text-green-700',
}

export default function OrderDetailPage() {
  return (
    <AuthGuard>
      <OrderDetailContent />
    </AuthGuard>
  )
}

function OrderDetailContent() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token } = useAuth()

  const { data: shipment, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['shipment', token, id],
    queryFn: () => getShipmentById(id).then((res) => res.data),
    enabled: !!token && !!id,
    retry: false,
  })

  const error = queryError
    ? ((queryError as any)?.response?.status === 404 ? 'Order not found.' : 'Could not load this order.')
    : ''

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
          Order Details
        </h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 lg:p-6">
        {loading ? (
          <OrderDetailSkeleton />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4" style={{ fontFamily: "'Urbanist', sans-serif" }}>{error}</p>
            <Link href="/orders" className="text-[#4043FF] font-semibold">Back to Orders</Link>
          </div>
        ) : shipment ? (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Urbanist', sans-serif" }}>Tracking ID</p>
                <p className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  {shipment.tracking_id}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${STATUS_STYLES[shipment.status] ?? 'bg-gray-100 text-gray-600'}`}
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
                <div className="flex justify-between gap-4"><dt>Address</dt><dd className="text-gray-900 text-right">{shipment.sender_address}</dd></div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: "'Urbanist', sans-serif" }}>Receiver</h2>
              <dl className="space-y-1 text-sm text-gray-600" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                <div className="flex justify-between"><dt>Name</dt><dd className="text-gray-900">{shipment.receiver_name}</dd></div>
                <div className="flex justify-between"><dt>Phone</dt><dd className="text-gray-900">{shipment.receiver_phone_number}</dd></div>
                <div className="flex justify-between"><dt>City</dt><dd className="text-gray-900">{shipment.receiver_city}</dd></div>
                <div className="flex justify-between gap-4"><dt>Address</dt><dd className="text-gray-900 text-right">{shipment.receiver_address}</dd></div>
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
          </div>
        ) : null}
      </main>
    </div>
  )
}