'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { useProfile } from '@/hooks/use-profile'
import { useWalletBalance, useTransactions } from '@/hooks/use-wallet'
import { BalanceSkeleton, TransactionHistorySkeleton } from '@/components/shared/skeletons'
import type { Transaction } from '@/lib/api/types'

const TRANSACTION_COLORS: Record<string, string> = {
  order: 'bg-blue-100 text-blue-600',
  topup: 'bg-green-100 text-green-600',
  payment: 'bg-purple-100 text-purple-600',
  wallet: 'bg-orange-100 text-orange-600',
}

function getTransactionColor(type: string | undefined) {
  return TRANSACTION_COLORS[type ?? ''] ?? 'bg-gray-100 text-gray-600'
}

function TransactionIcon({ type }: { type?: string }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function TransactionCard({ item, index }: { item: Transaction; index: number }) {
  const color = getTransactionColor(item.type)
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 flex items-start justify-between hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color} shrink-0`}>
          <TransactionIcon type={item.type} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-bold text-gray-900 truncate" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>
            {item.title ?? 'Transaction'}
          </p>
          <p className="text-xs lg:text-sm text-gray-600 line-clamp-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>
            {item.description ?? ''}
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1 shrink-0 ml-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>
        {item.created_at ?? ''}
      </span>
    </div>
  )
}

function HomeContent() {
  const router = useRouter()
  const { profile } = useProfile()
  const { data: balance, isLoading: balanceLoading } = useWalletBalance()
  const { data: recentTransactions = [], isLoading: transactionsLoading } = useTransactions(1, 4)

  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'New Shipment':
        router.push('/shipment/new')
        break
      case 'Check Rates':
        router.push('/rates')
        break
      case 'Nearby Drop':
        router.push('/locations')
        break
      case 'Help Center':
        router.push('/help')
        break
      default:
        alert(`${action} functionality coming soon!`)
    }
  }

  const quickActions = [
    {
      label: 'New Shipment',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
      ),
    },
    {
      label: 'Check Rates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3a8 8 0 100 16 8 8 0 008-8h-8z" /></svg>
      ),
    },
    {
      label: 'Nearby Drop',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s7-4.434 7-12.5A7 7 0 105 9.5C5 17.566 12 22 12 22z" /></svg>
      ),
    },
    {
      label: 'Help Center',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-8xl px-6 py-4 lg:px-6 lg:py-6">
      <section className="mb-6 lg:mb-8">
        <div className="flex items-start justify-between gap-4 mb-3 px-0.5">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 leading-tight" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              {greeting} <span aria-hidden="true">👋</span>
            </p>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mt-0.5" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              {profile ? `${profile.first_name} ${profile.last_name}` : ''}
            </h2>
          </div>
          <label className="md:hidden relative shrink-0">
            <span className="sr-only">Currency</span>
            <select
              defaultValue="USD"
              className="appearance-none bg-white border border-gray-200 rounded px-2 py-1 pr-6 text-[10px] text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4043FF]"
              style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
            </select>
            <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </label>
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl">
          {balanceLoading ? (
            <BalanceSkeleton />
          ) : (
            <>
              <img src="/home_card.png" alt="Balance card background" className="w-full h-auto" />
              <div className="absolute inset-0 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
                <div>
                  <p className="text-white/90 text-xs sm:text-sm font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Your balance</p>
                  <h3 className="text-white text-xl sm:text-3xl lg:text-4xl font-extrabold mt-1 sm:mt-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    {balance != null ? `${balance.toLocaleString()}.00NGN` : '---'}
                  </h3>
                  <button
                    onClick={() => router.push('/topup')}
                    className="mt-2 sm:mt-4 bg-white text-[#4043FF] hover:bg-gray-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold shadow transition-colors flex items-center gap-1"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 14l5-5 5 5z" />
                    </svg>
                    Top Up
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        {quickActions.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleQuickAction(item.label)}
            className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#E0E0FF] text-[#4043FF] flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-xs lg:text-sm font-bold text-gray-800 text-center" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>{item.label}</span>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>Transaction History</h3>
          <button
            onClick={() => router.push('/transactions')}
            className="text-[#4043FF] text-sm font-bold hover:text-[#3333CC] transition-colors"
            style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
          >
            See All
          </button>
        </div>
        {transactionsLoading ? (
          <TransactionHistorySkeleton />
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-3 lg:space-y-4">
            {recentTransactions.map((item, i) => <TransactionCard key={item.id ?? i} item={item} index={i} />)}
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <UserAppLayout activeNav="home">
      <HomeContent />
    </UserAppLayout>
  )
}
