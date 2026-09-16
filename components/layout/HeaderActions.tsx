'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'

interface HeaderActionsProps {
  showCurrencySelector?: boolean
  showNotifications?: boolean
  isAdmin?: boolean
  compact?: boolean
}

const notifications = [
  ['Today', 'Payment Successful!', 'You have made a shopping payment', 'bg-emerald-100 text-emerald-500'],
  ["Yesterday", "Today's Special Offers", 'You got a special promo today!', 'bg-amber-100 text-amber-500'],
  ['Yesterday', 'New Services Available!', 'Now you can search the nearby drop', 'bg-red-100 text-red-500'],
  ['December 20, 2024', 'Credit Card Connected!', 'Credit Card has been linked', 'bg-indigo-100 text-indigo-500'],
  ['December 20, 2024', 'Account Setup Successful!', 'Your account has been created', 'bg-emerald-100 text-emerald-500'],
] as const

export function HeaderActions({ showCurrencySelector = true, showNotifications = true, isAdmin = false, compact = false }: HeaderActionsProps) {
  const router = useRouter()
  const { displayName, profile } = useProfile()
  const { logout } = useAuth()
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [openMenu, setOpenMenu] = useState<'currency' | 'notifications' | 'profile' | null>(null)

  const closeMenu = () => setOpenMenu(null)

  return (
    <div className="flex items-center gap-2 lg:gap-3 shrink-0">
      {showCurrencySelector && (
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setOpenMenu((menu) => menu === 'currency' ? null : 'currency')}
            aria-expanded={openMenu === 'currency'}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {selectedCurrency}
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {openMenu === 'currency' && (
            <div className="absolute right-0 top-full z-50 mt-1 w-20 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
              {['NGN', 'USD'].map((currency) => (
                <button
                  key={currency}
                  type="button"
                  onClick={() => { setSelectedCurrency(currency); closeMenu() }}
                  className={`block w-full rounded px-2 py-1.5 text-left text-xs hover:bg-[#F0F0FF] ${selectedCurrency === currency ? 'font-bold text-[#4043FF]' : 'text-gray-700'}`}
                >
                  {currency}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <button type="button" onClick={() => router.push('/admin/orders')} className="hidden items-center gap-2 rounded-lg bg-[#4043FF] px-4 py-2 text-sm font-bold text-white hover:bg-[#3333CC] md:flex">Admin</button>
      )}

      {showNotifications && <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu((menu) => menu === 'notifications' ? null : 'notifications')}
          aria-label="Open notifications"
          aria-expanded={openMenu === 'notifications'}
          className="relative rounded-lg p-2 hover:bg-gray-100"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute right-1 top-1 block h-2 w-2 rounded-full bg-red-500" />
        </button>
        {openMenu === 'notifications' && (
          <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2"><button type="button" onClick={closeMenu} aria-label="Close notifications" className="text-gray-500 hover:text-gray-900">←</button><h2 className="text-sm font-bold text-gray-900">Notification</h2></div>
              <button type="button" onClick={closeMenu} aria-label="Close notifications" className="text-gray-400 hover:text-gray-700">×</button>
            </div>
            <div className="max-h-88 space-y-4 overflow-y-auto p-3">
              {notifications.map(([group, title, description, color], index) => (
                <div key={`${title}-${index}`}>
                  {(index === 0 || group !== notifications[index - 1][0]) && <p className="mb-2 text-[10px] font-semibold text-gray-700">{group}</p>}
                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 shadow-sm">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}><span className="text-sm font-bold">•</span></div>
                    <div className="min-w-0"><p className="truncate text-xs font-bold text-gray-900">{title}</p><p className="truncate text-[10px] text-gray-500">{description}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu((menu) => menu === 'profile' ? null : 'profile')}
          aria-expanded={openMenu === 'profile'}
          className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-50 lg:gap-3"
        >
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-300"><img src="/avatar-placeholder.png" alt="Profile" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /></div>
          <span className={`${compact ? 'hidden' : 'hidden md:block'} text-sm font-semibold text-gray-900`}>{displayName ?? 'Guest'}</span>
          <svg className="hidden h-4 w-4 shrink-0 text-gray-400 md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {openMenu === 'profile' && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
            <div className="border-b border-gray-100 px-3 py-2"><p className="text-sm font-bold text-gray-900">{displayName ?? 'Guest'}</p><p className="truncate text-xs text-gray-500">{profile?.email ?? 'Manage your account'}</p></div>
            <button type="button" onClick={() => { closeMenu(); router.push('/profile-setup') }} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50">Edit profile</button>
            <button type="button" onClick={() => { closeMenu(); router.push('/settings') }} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50">Settings</button>
            <button type="button" onClick={logout} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Log out</button>
          </div>
        )}
      </div>
    </div>
  )
}
