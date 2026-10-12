'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { OrderDetailSkeleton } from '@/components/shared/skeletons'
import { useShipmentById, usePayShipment } from '@/hooks/use-shipments'
import { useWalletBalance } from '@/hooks/use-wallet'
import { toast } from '@/components/ui/use-toast'
import { UserAppLayout } from '@/components/layout/UserAppLayout'

const STATUS_STYLES: Record<string, string> = {
  UNPAID: 'bg-yellow-100 text-yellow-700',
  SUBMITTED: 'bg-yellow-100 text-yellow-700',
  ON_PROCESS: 'bg-[#4043FF] text-white',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
}

// Friendly labels for the backend ShipmentStatus enum
// (UNPAID · SUBMITTED · ON_PROCESS · DELIVERED · CANCELLED).
const STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Unpaid',
  SUBMITTED: 'Awaiting pickup',
  ON_PROCESS: 'On Process',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
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
  const { data: balance } = useWalletBalance()
  const walletBalance = balance ?? null

  const error = queryError
    ? ((queryError as any)?.response?.status === 404 ? 'Order not found.' : 'Could not load this order.')
    : ''

  const priceNGN = shipment?.price != null ? Number(shipment.price) : null
  const walletHasSufficientBalance =
    walletBalance != null && priceNGN != null && walletBalance >= priceNGN

  const handlePayWithWallet = () => {
    if (!id) return
    payMutation.mutate(
      { id, payload: { payment_method: 'WALLET', currency: 'NGN' } },
      {
        onSuccess: () => {
          toast({
            title: 'Payment successful',
            description: 'Your shipment has been paid from your wallet.',
          })
        },
        onError: (err) => {
          const message =
            (err as any)?.response?.data?.message ||
            'Could not pay from your wallet. Please top up or pay by card.'
          toast({ title: 'Wallet payment failed', description: message })
        },
      },
    )
  }

  const handlePayWithCard = async () => {
    if (!id) return
    try {
      const paymentResponse = await payMutation.mutateAsync({
        id,
        payload: { payment_method: 'CARD', currency: 'NGN' },
      })

      const paymentData = (paymentResponse as any)?.data as Record<string, unknown> | undefined
      const authorizationUrl =
        paymentData?.authorization_url ||
        (paymentResponse as any)?.authorization_url ||
        paymentData?.checkout_url ||
        (paymentResponse as any)?.checkout_url

      if (!authorizationUrl) {
        toast({
          title: 'Checkout unavailable',
          description: 'Paystack did not return a checkout link. Please try again.',
        })
        return
      }

      const reference = paymentData?.reference ?? (paymentResponse as any)?.reference
      if (typeof reference === 'string' && reference) {
        try {
          window.sessionStorage.setItem('alcott_pending_shipment_ref', reference)
          window.sessionStorage.setItem('alcott_pending_shipment_id', id)
        } catch {
          // ignore storage errors
        }
      }

      window.location.href = authorizationUrl as string
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ||
        'Could not start card payment. Please try again.'
      toast({ title: 'Card payment failed', description: message })
    }
  }

  return (
    <div className="max-w-8xl mx-auto p-4 lg:p-6">
      {loading ? (
        <OrderDetailSkeleton />
      ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/orders" className="text-[#4043FF] font-semibold">Back to Orders</Link>
          </div>
        ) : shipment ? (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-1">Tracking ID</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {shipment.tracking_id || '—'}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 ${STATUS_STYLES[shipment.status] ?? 'bg-gray-100 text-gray-600'}`}

              >
                {STATUS_LABELS[shipment.status] ?? shipment.status}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Sender</h2>
              <dl className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><dt>Name</dt><dd className="text-gray-900">{shipment.sender_name}</dd></div>
                <div className="flex justify-between"><dt>Phone</dt><dd className="text-gray-900">{shipment.sender_phone_number}</dd></div>
                <div className="flex justify-between"><dt>City</dt><dd className="text-gray-900">{shipment.sender_city}</dd></div>
                <div className="flex justify-between gap-4"><dt className="shrink-0">Address</dt><dd className="text-gray-900 text-right min-w-0 wrap-break-word">{shipment.sender_address}</dd></div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Receiver</h2>
              <dl className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><dt>Name</dt><dd className="text-gray-900">{shipment.receiver_name}</dd></div>
                <div className="flex justify-between"><dt>Phone</dt><dd className="text-gray-900">{shipment.receiver_phone_number}</dd></div>
                <div className="flex justify-between"><dt>City</dt><dd className="text-gray-900">{shipment.receiver_city}</dd></div>
                <div className="flex justify-between gap-4"><dt className="shrink-0">Address</dt><dd className="text-gray-900 text-right min-w-0 wrap-break-word">{shipment.receiver_address}</dd></div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Package</h2>
              <dl className="space-y-1 text-sm text-gray-600">
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
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handlePayWithWallet}
                  disabled={payMutation.isPending || !walletHasSufficientBalance}
                  className="w-full rounded-xl bg-[#4043FF] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {payMutation.isPending
                    ? 'Processing payment...'
                    : priceNGN != null
                      ? `Pay ₦${priceNGN.toLocaleString()} from wallet`
                      : 'Pay from wallet'}
                </button>

                {!walletHasSufficientBalance && priceNGN != null && (
                  <p className="text-xs text-center text-amber-600">
                    Insufficient wallet balance. Top up or pay with card.
                  </p>
                )}

                <button
                  type="button"
                  onClick={handlePayWithCard}
                  disabled={payMutation.isPending}
                  className="w-full rounded-xl border-2 border-[#4043FF] px-4 py-3 text-sm font-semibold text-[#4043FF] hover:bg-[#4043FF]/5 disabled:opacity-60"
                >
                  Pay with Card (Paystack)
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Card payments are processed securely by Paystack. Your card details are never stored, and your wallet balance is not used.
                </p>
              </div>
            )}
          </div>
        ) : null}
    </div>
  )
}