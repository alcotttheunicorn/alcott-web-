'use client'

import { useState } from 'react'
import { useCurrency, type CurrencyCode } from '@/components/providers/currency-provider'

const currencies: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
]

export function CurrencySelector({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-label="Choose display currency"
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        {currency === 'NGN' ? '₦ NGN' : '$ USD'}
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
          {currencies.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => { setCurrency(option.code); setOpen(false) }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-[#F0F0FF] ${currency === option.code ? 'font-bold text-[#4043FF]' : 'text-gray-700'}`}
            >
              <span className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0E0FF] text-xs font-bold text-[#4043FF]">{option.symbol}</span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">{option.code}</span>
                  <span className="text-[10px] font-normal text-gray-400">{option.name}</span>
                </span>
              </span>
              {currency === option.code && <span aria-hidden="true" className="text-[#4043FF]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
