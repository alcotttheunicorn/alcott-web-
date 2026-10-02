'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CurrencyCode = 'NGN' | 'USD'

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)
const STORAGE_KEY = 'alcott_display_currency'

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('NGN')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'NGN' || saved === 'USD') setCurrencyState(saved)
  }, [])

  const setCurrency = (nextCurrency: CurrencyCode) => {
    setCurrencyState(nextCurrency)
    try {
      window.localStorage.setItem(STORAGE_KEY, nextCurrency)
    } catch {
      // Keep the in-memory preference if storage is unavailable.
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider')
  return context
}
