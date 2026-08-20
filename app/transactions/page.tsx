'use client'

import { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { CreditCard, Package, Plus, Wallet } from 'lucide-react'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { TransactionListSkeleton } from '@/components/shared/skeletons'
import { useAuth } from '@/hooks/use-auth'
import { getTransactions } from '@/lib/api/wallet-api'

const transactionStyles = {
  order: { className: 'bg-blue-100 text-blue-600', Icon: Package },
  topup: { className: 'bg-green-100 text-green-600', Icon: Plus },
  payment: { className: 'bg-purple-100 text-purple-600', Icon: CreditCard },
  wallet: { className: 'bg-orange-100 text-orange-600', Icon: Wallet },
} as const

function TransactionRow({ transaction }: { transaction: { type?: string; title?: string; description?: string; created_at?: string } }) {
  const style = transactionStyles[transaction.type as keyof typeof transactionStyles] ?? { className: 'bg-gray-100 text-gray-600', Icon: Wallet }
  const { Icon } = style
  return <article className="bg-white border-b border-gray-100 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"><div className="flex items-center gap-4 min-w-0"><div className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${style.className}`}><Icon className="w-5 h-5" /></div><div className="min-w-0"><h2 className="font-semibold text-gray-900 truncate">{transaction.title ?? 'Transaction'}</h2><p className="text-sm text-gray-500 truncate">{transaction.description ?? ''}</p></div></div><time className="ml-3 shrink-0 text-sm text-[#4043FF]">{transaction.created_at ?? ''}</time></article>
}

export default function TransactionHistoryPage() {
  const { token } = useAuth()
  const query = useInfiniteQuery({ queryKey: ['wallet-transactions-infinite', token], queryFn: ({ pageParam }) => getTransactions(pageParam, 20), initialPageParam: 1, getNextPageParam: (lastPage, pages) => pages.length < (lastPage.totalPages ?? 1) ? pages.length + 1 : undefined, enabled: Boolean(token) })
  const transactions = query.data?.pages.flatMap((page) => page.data?.transactions ?? []) ?? []
  useEffect(() => { const loadMore = () => { if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 2 && query.hasNextPage && !query.isFetching) query.fetchNextPage() }; window.addEventListener('scroll', loadMore); return () => window.removeEventListener('scroll', loadMore) }, [query.fetchNextPage, query.hasNextPage, query.isFetching])
  return <UserAppLayout contentBgClass="bg-[#F8F9FA]"><div className="max-w-4xl mx-auto p-4 lg:p-6"><div className="space-y-0">{query.isLoading ? <TransactionListSkeleton /> : transactions.map((transaction, index) => <TransactionRow key={transaction.id ?? index} transaction={transaction} />)}{query.isFetching && !query.isLoading && <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" /></div>}{!query.hasNextPage && transactions.length > 0 && <p className="text-center py-8 text-gray-500">You&apos;ve reached the end of your transaction history.</p>}</div></div></UserAppLayout>
}
