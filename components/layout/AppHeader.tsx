'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/use-profile'

interface HeaderTitleConfig {
    title: string
    onBack?: () => void
}

interface AppHeaderProps {
    mobileMenuOpen: boolean
    onToggleMobileMenu: () => void
    headerTitle?: HeaderTitleConfig
    searchPlaceholder?: string
    searchOnNavigateToSearchPage?: boolean
    showCurrencySelector?: boolean
    showNotifications?: boolean
    isAdmin?: boolean
    showSearch?: boolean
}

export function AppHeader({
    onToggleMobileMenu,
    headerTitle,
    searchPlaceholder,
    searchOnNavigateToSearchPage,
    showCurrencySelector,
    showNotifications,
    isAdmin,
    showSearch = true,
}: AppHeaderProps) {
    const { displayName } = useProfile()
    const [selectedCurrency, setSelectedCurrency] = useState('NGN')
    const [searchValue, setSearchValue] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearchFocus = () => {
        if (searchOnNavigateToSearchPage) {
            router.push('/search')
        } else {
            setIsSearchFocused(true)
        }
    }

    const handleRecentSearchClick = (search: string) => {
        setSearchValue(search)
        setIsSearchFocused(false)
    }

    const handleClearAllRecents = () => {
        setRecentSearches([])
    }

    return (
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 shrink-0">
            <div className="flex items-center justify-between gap-2">
                <button onClick={onToggleMobileMenu} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {headerTitle ? (
                    <div className="flex items-center gap-3 shrink-0">
                        {headerTitle.onBack !== undefined && (
                            <button onClick={headerTitle.onBack} className="p-2 rounded-lg hover:bg-gray-100">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                            {headerTitle.title}
                        </h1>
                    </div>
                ) : null}

                {showSearch && (
                <div className="flex-1 max-w-md mx-4" ref={searchRef}>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={searchPlaceholder ?? 'Enter Tracking Number, Name or Email'}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={handleSearchFocus}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:bg-white text-gray-900 placeholder:text-gray-500 font-bold"
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                        />
                        {isSearchFocused && !searchOnNavigateToSearchPage && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500">Recent</span>
                                    <button onClick={handleClearAllRecents} className="text-xs text-[#4043FF] font-semibold">Clear All</button>
                                </div>
                                <div className="py-2">
                                    {recentSearches.length > 0 ? (
                                        recentSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleRecentSearchClick(search)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                            >
                                                {search}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-sm text-gray-500">No recent searches</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                )}

                <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                    {showNotifications && (
                        <button className="relative p-2 rounded-lg hover:bg-gray-100">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                    )}

                    {isAdmin && (
                        <button
                            onClick={() => router.push('/admin/orders')}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#4043FF] text-white text-sm font-bold rounded-lg hover:bg-[#3333CC] transition-colors"
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin
                        </button>
                    )}

                    {showCurrencySelector && (
                        <div className="hidden md:block relative">
                            <select
                                value={selectedCurrency}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                                style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                            >
                                <option value="NGN">NGN</option>
                                <option value="USD">USD</option>
                            </select>
                            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    )}

                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0">
                            <img src="/avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" onError={(e: any) => { e.currentTarget.style.display = 'none' }} />
                        </div>
                        <div className="hidden md:block text-sm font-semibold text-gray-900" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                            {displayName ?? 'Guest'}
                        </div>
                        <svg className="hidden md:block w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    )
}
