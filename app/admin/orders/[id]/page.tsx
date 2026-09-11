'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { OrderInfoBar } from '@/components/admin/OrderInfoBar'
import { DetailInfoCard } from '@/components/admin/DetailInfoCard'
import { ActionsCard, type CompleteMethod } from '@/components/admin/ActionsCard'
import { DeliveryInfoCard } from '@/components/admin/DeliveryInfoCard'
import { EventLogCard } from '@/components/admin/EventLogCard'
import { FinanceCard } from '@/components/admin/FinanceCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { OrderDetailSkeleton } from '@/components/shared/skeletons'
import {
  useAdminShipment,
  useAdminShipmentEvents,
  useAdminEvents,
  useCompleteAdminShipment,
  useStartProcessingShipment,
  useDeliverShipment,
  useCancelAdminShipment,
  useAppendShipmentEvent,
} from '@/hooks/use-admin'

function mapStatusToBadge(status: string | undefined): string {
  switch (status) {
    case 'ON_PROCESS': return 'on_process'
    case 'DELIVERED': return 'delivered'
    case 'CANCELLED': return 'canceled'
    case 'UNPAID': return 'initiated'
    case 'SUBMITTED': return 'pending'
    default: return status ? status.toLowerCase().replace(/_/g, ' ') : 'pending'
  }
}

function fmtDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return '--:--'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function str(value: unknown, fallback = '—'): string {
  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number' && !Number.isNaN(value)) return String(value)
  return fallback
}

function getField(obj: Record<string, unknown> | undefined, key: string): unknown {
  return obj?.[key]
}

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params.id as string

  const { data: shipment, isLoading, error: queryError } = useAdminShipment(orderId)
  const { data: events = [] } = useAdminShipmentEvents(orderId)
  const { data: catalogEvents = [] } = useAdminEvents({ limit: 50 })

  const startProcessing = useStartProcessingShipment()
  const markDelivered = useDeliverShipment()
  const cancelOrder = useCancelAdminShipment()
  const completeOrder = useCompleteAdminShipment()
  const appendEvent = useAppendShipmentEvent()

  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState('')
  const [location, setLocation] = useState('')

  const busy =
    startProcessing.isPending ||
    markDelivered.isPending ||
    cancelOrder.isPending ||
    completeOrder.isPending ||
    appendEvent.isPending

  const handleError = (err: unknown) => {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    toast({ title: 'Action failed', description: e?.response?.data?.message || e?.message || 'Could not update this order.' })
  }

  const handleStartProcessing = async () => {
    try {
      await startProcessing.mutateAsync(orderId)
      toast({ title: 'Order updated', description: 'Shipment is now ON_PROCESS.' })
    } catch (err) {
      handleError(err)
    }
  }

  const handleDeliver = async () => {
    try {
      await markDelivered.mutateAsync(orderId)
      toast({ title: 'Order updated', description: 'Shipment marked as delivered.' })
    } catch (err) {
      handleError(err)
    }
  }

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync(orderId)
      toast({ title: 'Order updated', description: 'Shipment cancelled.' })
    } catch (err) {
      handleError(err)
    }
  }

  const handleComplete = async (method: CompleteMethod) => {
    try {
      const res = await completeOrder.mutateAsync({ id: orderId, payment_method: method })
      const checkoutUrl = method === 'CARD' ? (res as { data?: { authorization_url?: string } })?.data?.authorization_url : undefined
      if (checkoutUrl) window.open(checkoutUrl, '_blank')
      toast({
        title: 'Order completed',
        description: method === 'CARD' ? 'Paystack checkout opened for this order.' : 'Shipment moved to SUBMITTED.',
      })
    } catch (err) {
      handleError(err)
    }
  }

  const handleAppendEvent = async () => {
    if (!selectedEventId || !location.trim()) {
      toast({ title: 'Missing details', description: 'Pick an event and enter a location.' })
      return
    }
    try {
      await appendEvent.mutateAsync({ id: orderId, event_id: selectedEventId, location: location.trim() })
      toast({ title: 'Event added', description: 'Event appended to the timeline.' })
      setShowEventForm(false)
      setSelectedEventId('')
      setLocation('')
    } catch (err) {
      handleError(err)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <OrderDetailSkeleton />
      </div>
    )
  }

  if (!shipment) {
    const notFound = (queryError as { response?: { status?: number } } | null | undefined)?.response?.status === 404
    return (
      <div className="p-6">
        <AdminPageHeader title="ORDERS DETAILS" backHref="/admin/orders" />
        <EmptyState message={notFound ? 'Order not found.' : 'Could not load this order.'} />
      </div>
    )
  }

  const paid = ['SUBMITTED', 'ON_PROCESS', 'DELIVERED'].includes(shipment.status ?? '')
  const paymentStatus = str(getField(shipment, 'payment_status'), paid ? 'PAID' : 'UNPAID')

  const minDays = typeof shipment.min_delivery_days === 'number' ? shipment.min_delivery_days : undefined
  const maxDays = typeof shipment.max_delivery_days === 'number' ? shipment.max_delivery_days : undefined

  const senderCity = str(shipment.sender_city, '').trim()
  const senderAddress = senderCity && !(shipment.sender_address?.includes(senderCity))
    ? `${senderCity}, ${str(shipment.sender_address)}`
    : str(shipment.sender_address)

  const receiverCity = str(shipment.receiver_city, '').trim()
  const receiverAddress = receiverCity && !(shipment.receiver_address?.includes(receiverCity))
    ? `${receiverCity}, ${str(shipment.receiver_address)}`
    : str(shipment.receiver_address)

  const dims = [
    typeof shipment.package_length === 'number' ? `${shipment.package_length}cm` : null,
    typeof shipment.package_width === 'number' ? `${shipment.package_width}cm` : null,
    typeof shipment.package_height === 'number' ? `${shipment.package_height}cm` : null,
  ].filter(Boolean).join(' × ')

  const eventLog = events.map((e) => ({
    event: str(e.event_name, str(e.event_id)),
    time: fmtDate(e.created_at),
  }))

  return (
    <div className="p-6">
      <AdminPageHeader title="ORDERS DETAILS" backHref="/admin/orders" />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <OrderInfoBar
            charge={shipment.price ?? 0}
            currency="NGN"
            orderId={shipment.tracking_id ?? null}
            status={mapStatusToBadge(shipment.status)}
            submittedAt={fmtDate(shipment.created_at)}
            processingStart={fmtDate(getField(shipment, 'processing_started_at'))}
            processingEnd={fmtDate(getField(shipment, 'processing_ended_at'))}
          />
          <DetailInfoCard title="Sender" fields={[
            { label: 'Sender name', value: str(shipment.sender_name) },
            { label: 'Sender phone', value: str(shipment.sender_phone_number) },
            { label: 'Sender email', value: str(shipment.sender_email) },
            { label: 'Sender address', value: senderAddress },
          ]} />
          <DetailInfoCard title="Receiver" fields={[
            { label: 'Receiver name', value: str(shipment.receiver_name) },
            { label: 'Receiver phone', value: str(shipment.receiver_phone_number) },
            { label: 'Receiver email', value: str(shipment.receiver_email) },
            { label: 'Receiver address', value: receiverAddress },
          ]} />
          <DetailInfoCard title="Package" fields={[
            { label: 'Package category', value: str(shipment.package_category) },
            { label: 'Package weight', value: typeof shipment.package_weight === 'number' ? `${shipment.package_weight} kg` : '—' },
            { label: 'Package dimensions', value: dims || '—' },
            { label: 'Price', value: typeof shipment.price === 'number' ? `NGN ${shipment.price.toLocaleString()}` : '—' },
          ]} />
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <ActionsCard
            status={shipment.status}
            disabled={busy}
            onStartProcessing={handleStartProcessing}
            onDeliver={handleDeliver}
            onCancel={handleCancel}
            onComplete={handleComplete}
          />
          <DeliveryInfoCard estDays={maxDays || minDays || 0} estDate="—" />
          <EventLogCard events={eventLog} onNewEvent={() => setShowEventForm((prev) => !prev)} />

          {showEventForm && (
            <div className="bg-[#F6F7FB] border border-gray-200 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase">Add Event</h4>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
              >
                <option value="">Select event…</option>
                {catalogEvents.map((e) => (
                  <option key={e.id ?? e.name ?? 'event'} value={e.id ?? ''}>
                    {str(e.name)}
                  </option>
                ))}
              </select>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
              />
              <button
                onClick={handleAppendEvent}
                disabled={busy}
                className="w-full h-10 rounded-md bg-[#4043FF] text-white text-sm font-semibold hover:bg-[#3333CC] transition-colors disabled:opacity-50"
              >
                Add Event
              </button>
            </div>
          )}

          <FinanceCard
            amountPaid={paid && typeof shipment.price === 'number' ? shipment.price : 0}
            paymentMethod={str(shipment.payment_method, '—')}
            paymentStatus={paymentStatus.toUpperCase()}
            expenses={0}
            profit={0}
            currency="NGN"
          />
        </div>
      </div>
    </div>
  )
}