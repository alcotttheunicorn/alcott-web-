'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/use-profile'
import { useAuth } from '@/hooks/use-auth'
import { HeaderActions } from './HeaderActions'

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
    const { displayName, profile } = useProfile()
    const { logout } = useAuth()
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
        <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
            <div className="mx-auto flex w-full max-w-8xl items-center justify-between gap-2">
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
                <div className="flex-1 max-w-md mr-4" ref={searchRef}>
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

                {!headerTitle && !showSearch && <div className="flex-1" />}

                <HeaderActions showCurrencySelector={showCurrencySelector} showNotifications={showNotifications} isAdmin={isAdmin} />
            </div>
        </header>
    )
}
