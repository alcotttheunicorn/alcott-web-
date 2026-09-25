'use client'

import { useEffect } from 'react'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { useTransactionsInfinite } from '@/hooks/use-wallet'
import { formatDateTime } from '@/lib/utils'

export default function TransactionHistoryPage() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching: loading,
  } = useTransactionsInfinite(20)

  const transactions = data?.pages.flatMap((page) => page.data?.transactions ?? []) ?? []
  const hasMore = !!hasNextPage

  const loadMore = () => {
    if (loading || !hasMore) return
    fetchNextPage()
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
        return
      }
      loadMore()
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore])

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600'
      case 'topup':
        return 'bg-green-100 text-green-600'
      case 'payment':
        return 'bg-purple-100 text-purple-600'
      case 'wallet':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <UserAppLayout activeNav="home" headerTitle={{ title: 'Transaction History' }}>
      <div className="mx-auto w-full max-w-8xl px-4 py-4 lg:px-6 lg:py-6">
        {/* Transaction List */}
        <div className="space-y-0">
          {transactions.map((transaction, index) => (
            <div key={transaction.id ?? index} className="bg-white border-b border-gray-100 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type ?? '')} shrink-0`}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    {transaction.type === 'order' && (
                      <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                    )}
                    {transaction.type === 'topup' && (
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    )}
                    {transaction.type === 'payment' && (
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    )}
                    {transaction.type === 'wallet' && (
                      <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    )}
                    {!transaction.type && (
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    )}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 font-[Urbanist] mb-1" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    {transaction.title ?? 'Transaction'}
                  </p>
                  <p className="text-sm text-gray-500 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    {transaction.description ?? ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-[#4043FF] font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', color: '#4043FF' }}>
                  {formatDateTime(transaction.created_at)}
                </span>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]"></div>
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && transactions.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                You've reached the end of your transaction history
              </p>
            </div>
          )}
        </div>
      </div>
    </UserAppLayout>
  )
}