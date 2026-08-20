'use client'

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { getBalance, initializeFund, verifyFund, getTransactions } from '@/lib/api/wallet-api'
import { queryKeys } from '@/components/providers/query-provider'

export function useWalletBalance() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.wallet.balance,
    queryFn: () => getBalance().then((res) => res.data.balance),
    enabled: isAuthenticated,
  })
}

export function useTransactions(page = 1, limit = 20) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: [...queryKeys.wallet.transactions, page, limit],
    queryFn: () => getTransactions(page, limit).then((res) => res.data?.transactions ?? []),
    enabled: isAuthenticated,
  })
}

export function useTransactionsInfinite(limit = 20) {
  const { isAuthenticated } = useAuth()

  return useInfiniteQuery({
    queryKey: queryKeys.wallet.transactionsInfinite,
    queryFn: ({ pageParam }) => getTransactions(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length < (lastPage.totalPages ?? 1) ? allPages.length + 1 : undefined,
    enabled: isAuthenticated,
  })
}

export function useInitializeFund() {
  return useMutation({
    mutationFn: (amount: number) => initializeFund(amount),
  })
}

export function useVerifyFund() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reference: string) => verifyFund(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactionsInfinite })
    },
  })
}
