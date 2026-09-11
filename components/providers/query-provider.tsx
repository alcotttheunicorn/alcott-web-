'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { clearSession } from '@/lib/auth-store'

export const queryKeys = {
  auth: {
    profile: ['profile'] as const,
  },
  wallet: {
    balance: ['wallet', 'balance'] as const,
    transactions: ['wallet', 'transactions'] as const,
    transactionsInfinite: ['wallet', 'transactions', 'infinite'] as const,
  },
  shipments: {
    all: ['shipments'] as const,
    detail: (id: string) => ['shipments', 'detail', id] as const,
    tracking: (trackingId: string) => ['shipments', 'tracking', trackingId] as const,
    categories: ['shipments', 'categories'] as const,
  },
  admin: {
    users: ['admin', 'users'] as const,
    shipments: ['admin', 'shipments'] as const,
    shipmentDetail: (id: string) => ['admin', 'shipments', id] as const,
    shipmentEvents: (id: string) => ['admin', 'shipments', id, 'events'] as const,
    events: ['admin', 'events'] as const,
    activityLogs: ['admin', 'activity-logs'] as const,
    rateChecks: ['admin', 'rate-checks'] as const,
  },
  pricing: {
    overview: ['pricing', 'admin', 'overview'] as const,
    zones: ['pricing', 'admin', 'zones'] as const,
    regions: ['pricing', 'admin', 'regions'] as const,
    premise: ['pricing', 'admin', 'premise'] as const,
    exchangeRate: ['pricing', 'exchange-rate'] as const,
  },
} as const

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error: any) => {
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            return false
          }
          return failureCount < 1
        },
        refetchOnWindowFocus: false,
        throwOnError: (error: any) => {
          if (error?.response?.status === 401) {
            clearSession()
            return false
          }
          return false
        },
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
