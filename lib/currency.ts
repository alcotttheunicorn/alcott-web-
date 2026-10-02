import type { CurrencyCode } from '@/components/providers/currency-provider'

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode, ngnPerUsd?: number): number | null {
  if (from === to) return amount
  if (!ngnPerUsd || !Number.isFinite(ngnPerUsd) || ngnPerUsd <= 0) return null
  return from === 'NGN' ? amount / ngnPerUsd : amount * ngnPerUsd
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(amount)
}
