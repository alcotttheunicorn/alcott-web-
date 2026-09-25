'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { useProfile } from '@/hooks/use-profile'
import { useWalletBalance, useTransactions } from '@/hooks/use-wallet'
import { BalanceSkeleton, TransactionHistorySkeleton } from '@/components/shared/skeletons'
import { formatDateTime } from '@/lib/utils'
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
        {formatDateTime(item.created_at)}
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
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [currencyOpen, setCurrencyOpen] = useState(false)

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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1095 0.0120578C18.7878 -0.0928337 20.4428 0.489897 21.6898 1.63205C22.832 2.87909 23.4147 4.53405 23.3215 6.22396V17.1094C23.4264 18.7993 22.832 20.4542 21.7015 21.7013C20.4544 22.8434 18.7878 23.4262 17.1095 23.3213H6.22401C4.53408 23.4262 2.87911 22.8434 1.63206 21.7013C0.489901 20.4542 -0.0928344 18.7993 0.0120579 17.1094V6.22396C-0.0928344 4.53405 0.489901 2.87909 1.63206 1.63205C2.87911 0.489897 4.53408 -0.0928337 6.22401 0.0120578H17.1095ZM10.478 17.3192L18.3216 9.45229C19.0325 8.7297 19.0325 7.56424 18.3216 6.85331L16.8065 5.33821C16.0839 4.61563 14.9184 4.61563 14.1958 5.33821L13.415 6.13073C13.2984 6.24727 13.2984 6.4454 13.415 6.56195C13.415 6.56195 15.2681 8.40338 15.303 8.45C15.4312 8.58985 15.5128 8.77632 15.5128 8.98611C15.5128 9.40567 15.1748 9.75531 14.7436 9.75531C14.5455 9.75531 14.359 9.67373 14.2308 9.54553L12.2845 7.61086C12.1912 7.51763 12.0281 7.51763 11.9348 7.61086L6.37553 13.1701C5.99092 13.5547 5.76948 14.0675 5.75783 14.6153L5.6879 17.3774C5.6879 17.5289 5.73452 17.6688 5.83941 17.7737C5.9443 17.8786 6.08416 17.9368 6.23567 17.9368H8.97452C9.53395 17.9368 10.0701 17.7154 10.478 17.3192Z" fill="url(#paint0_linear_3596_3272)"/>
          <defs>
          <linearGradient id="paint0_linear_3596_3272" x1="23.3333" y1="23.3333" x2="-4.43124" y2="15.2833" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4043FF"/>
          <stop offset="1" stop-color="#8486FF"/>
          </linearGradient>
          </defs>
        </svg>

      ),
    },
    {
      label: 'Check Rates',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6667 0C5.23367 0 0 5.23367 0 11.6667C0 18.0997 5.23367 23.3333 11.6667 23.3333C18.0997 23.3333 23.3333 18.0997 23.3333 11.6667C23.3333 5.23367 18.0997 0 11.6667 0ZM12.8333 17.4008V18.6667H10.5V17.4067C7.77117 16.9785 7 15.071 7 14H9.33333C9.34617 14.1668 9.51883 15.1667 11.6667 15.1667C13.2767 15.1667 14 14.4842 14 14C14 13.622 14 12.8333 11.6667 12.8333C7.60667 12.8333 7 10.64 7 9.33333C7 7.83067 8.2005 6.31867 10.5 5.9325V4.68067H12.8333V5.9745C14.8563 6.45283 15.6333 8.13633 15.6333 9.33333H14.4667L13.3 9.35433C13.2837 8.911 13.0492 8.16667 11.6667 8.16667C10.1512 8.16667 9.33333 8.76867 9.33333 9.33333C9.33333 9.76967 9.33333 10.5 11.6667 10.5C15.7267 10.5 16.3333 12.6933 16.3333 14C16.3333 15.5027 15.1328 17.0147 12.8333 17.4008Z" fill="url(#paint0_linear_3596_1249)"/>
          <defs>
          <linearGradient id="paint0_linear_3596_1249" x1="23.3333" y1="23.3333" x2="-4.43124" y2="15.2833" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4043FF"/>
          <stop offset="1" stop-color="#8486FF"/>
          </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      label: 'Nearby Drop',
      icon: (
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.70405C0 4.33754 4.48453 0 9.90902 0C15.3488 0 19.8333 4.33754 19.8333 9.70405C19.8333 12.4083 18.8498 14.9189 17.2311 17.0468C15.4453 19.3941 13.2442 21.4392 10.7666 23.0445C10.1996 23.4155 9.68785 23.4435 9.06553 23.0445C6.57386 21.4392 4.37277 19.3941 2.60225 17.0468C0.982314 14.9189 0 12.4083 0 9.70405ZM6.64327 10.0062C6.64327 11.804 8.11027 13.2179 9.90902 13.2179C11.7089 13.2179 13.1901 11.804 13.1901 10.0062C13.1901 8.22243 11.7089 6.73964 9.90902 6.73964C8.11027 6.73964 6.64327 8.22243 6.64327 10.0062Z" fill="url(#paint0_linear_3596_4105)"/>
          <defs>
          <linearGradient id="paint0_linear_3596_4105" x1="19.8333" y1="23.3333" x2="-4.28557" y2="17.3892" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4043FF"/>
          <stop offset="1" stop-color="#8486FF"/>
          </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      label: 'Help Center',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.615 0H16.73C20.685 0 23.3333 2.77667 23.3333 6.90667V16.4395C23.3333 20.5578 20.685 23.3333 16.73 23.3333H6.615C2.66 23.3333 0 20.5578 0 16.4395V6.90667C0 2.77667 2.66 0 6.615 0ZM11.655 8.23783C11.1067 8.23783 10.6517 7.78167 10.6517 7.22283C10.6517 6.65117 11.1067 6.19617 11.6783 6.19617C12.2383 6.19617 12.6933 6.65117 12.6933 7.22283C12.6933 7.78167 12.2383 8.23783 11.655 8.23783ZM12.6817 16.0778C12.6817 16.6378 12.2267 17.0928 11.655 17.0928C11.095 17.0928 10.64 16.6378 10.64 16.0778V10.9212C10.64 10.36 11.095 9.8945 11.655 9.8945C12.2267 9.8945 12.6817 10.36 12.6817 10.9212V16.0778Z" fill="url(#paint0_linear_3596_330)"/>
          <defs>
          <linearGradient id="paint0_linear_3596_330" x1="23.3333" y1="23.3333" x2="-4.43124" y2="15.2833" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4043FF"/>
          <stop offset="1" stop-color="#8486FF"/>
          </linearGradient>
          </defs>
        </svg>
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
          <div className="md:hidden relative shrink-0">
            <button
              type="button"
              onClick={() => setCurrencyOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
            >
              {selectedCurrency === 'NGN' ? '₦ NGN' : '$ USD'}
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {currencyOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                {[
                  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
                  { code: 'USD', symbol: '$', name: 'US Dollar' },
                ].map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => { setSelectedCurrency(currency.code); setCurrencyOpen(false) }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-[#F0F0FF] ${selectedCurrency === currency.code ? 'font-bold text-[#4043FF]' : 'text-gray-700'}`}
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0E0FF] text-xs font-bold text-[#4043FF]">
                        {currency.symbol}
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold">{currency.code}</span>
                        <span className="text-[10px] font-normal text-gray-400">{currency.name}</span>
                      </span>
                    </span>
                    {selectedCurrency === currency.code && (
                      <svg className="h-4 w-4 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl">
          {balanceLoading ? (
            <BalanceSkeleton />
          ) : (
            <>
              <img src="/home_card.png" alt="Balance card background" className="w-full h-auto" />
              <div className="absolute inset-0 flex items-center justify-between gap-x-3 sm:flex-col sm:items-start sm:justify-center sm:gap-y-6 px-4 sm:px-10 lg:px-14 py-2 sm:py-6">
                <div className="min-w-0">
                  <p className="text-white/90 text-xs sm:text-sm font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Your balance</p>
                  <h3 className="text-white text-xl sm:text-3xl lg:text-4xl font-extrabold mt-1 sm:mt-5 truncate" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    {balance != null ? `${balance.toLocaleString()}.00NGN` : '---'}
                  </h3>
                </div>
                <button
                  onClick={() => router.push('/topup')}
                  className="shrink-0 bg-white text-[#4043FF] hover:bg-gray-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold shadow transition-colors flex items-center gap-1"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                >
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.69175 3.9921V0.651254C7.69175 0.296024 7.97508 0 8.33342 0C8.65425 0 8.92607 0.248743 8.96914 0.563817L8.97508 0.651254V3.9921L12.9583 3.99235C14.9417 3.99235 16.5711 5.61648 16.6626 7.64201L16.6667 7.82174V12.0212C16.6667 14.0609 15.0939 15.7352 13.14 15.8292L12.9667 15.8333H3.7C1.71667 15.8333 0.0950748 14.2173 0.00403149 12.1844L0 12.0039L0 7.81314C0 5.77342 1.56492 4.09101 3.51833 3.99654L3.69167 3.99235H7.69167V9.32768L6.35833 7.95082C6.10833 7.69266 5.7 7.69266 5.45 7.95082C5.325 8.0799 5.26667 8.25201 5.26667 8.42412C5.26667 8.55492 5.304 8.69123 5.38293 8.80661L5.45 8.88881L7.875 11.4016C7.99167 11.5307 8.15833 11.5995 8.33333 11.5995C8.47222 11.5995 8.61111 11.5517 8.72106 11.4611L8.78333 11.4016L11.2083 8.88881C11.4583 8.63064 11.4583 8.20898 11.2083 7.95082C10.9811 7.71613 10.6229 7.69479 10.3719 7.88681L10.3 7.95082L8.975 9.32768V3.99235L7.69175 3.9921Z" fill="#4043FF"/>
                  </svg>
                  Top Up
                </button>
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
            <div className="w-12 h-12 rounded-full bg-[#E0E0FF] text-[#4043FF] flex items-center justify-center">
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
