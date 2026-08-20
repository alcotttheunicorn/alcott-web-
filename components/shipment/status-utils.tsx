import { cn } from '@/lib/utils'
import type { ShipmentData } from '@/lib/api/types'

export type ShipmentStatusKey = 'pending' | 'onprocess' | 'delivered'

export interface ShipmentStatusDisplay {
  key: ShipmentStatusKey
  text: string
  label: string
  colorClass: string
}

const STATUS_MAP: Record<string, ShipmentStatusDisplay> = {
  PENDING: { key: 'pending', text: 'Awaiting pickup', label: 'Pending', colorClass: 'bg-yellow-100 text-yellow-700' },
  ONGOING: { key: 'onprocess', text: 'On transit', label: 'On Process', colorClass: 'bg-[#4043FF] text-white' },
  DELIVERED: { key: 'delivered', text: 'Package received', label: 'Completed', colorClass: 'bg-green-100 text-green-700' },
}

export function getShipmentStatus(status: string | undefined): ShipmentStatusDisplay {
  return STATUS_MAP[status ?? ''] ?? {
    key: 'pending',
    text: status ?? 'Unknown',
    label: status ?? 'Unknown',
    colorClass: 'bg-gray-100 text-gray-600',
  }
}

export interface OrderViewModel {
  id: string
  trackingNumber: string
  status: ShipmentStatusKey
  statusText: string
  statusLabel: string
  statusColor: string
  raw: ShipmentData
}

export function mapShipmentToOrder(s: ShipmentData): OrderViewModel {
  const display = getShipmentStatus(s.status)
  return {
    id: s.id,
    trackingNumber: s.tracking_id,
    status: display.key,
    statusText: display.text,
    statusLabel: display.label,
    statusColor: display.colorClass,
    raw: s,
  }
}

interface StatusBadgeProps {
  status: string | undefined
  className?: string
}

export function ShipmentStatusBadge({ status, className }: StatusBadgeProps) {
  const display = getShipmentStatus(status)
  return (
    <span
      className={cn('px-4 py-1.5 rounded-full text-xs font-semibold', display.colorClass, className)}
      style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
    >
      {display.label}
    </span>
  )
}
