import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats an ISO timestamp like 2026-09-18T12:14:19.855Z into
// "2026-09-18 12:14" (date part + HH:MM time).
export function formatDateTime(value?: string | null) {
  if (!value) return ''
  const [date, time] = value.split('T')
  return `${date} ${time?.slice(0, 5) ?? ''}`.trim()
}
