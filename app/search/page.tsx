'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { useShipmentByTrackingId } from '@/hooks/use-shipments'
import type { ShipmentData } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

const RECENT_SEARCHES_KEY = 'alcott.recentTrackingSearches'
const MAX_RECENT_SEARCHES = 7

function loadRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === 'undefined') return
  const existing = loadRecentSearches().filter((s) => s.toLowerCase() !== query.toLowerCase())
  const updated = [query, ...existing].slice(0, MAX_RECENT_SEARCHES)
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  return updated
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ShipmentData[]>([])
  const [searchError, setSearchError] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const {
    data: searchData,
    isPending: isLoading,
    error: queryError,
  } = useShipmentByTrackingId(submittedQuery.trim())

  useEffect(() => {
    setRecentSearches(loadRecentSearches())
  }, [])

  useEffect(() => {
    const query = searchParams.get('q')
    if (query && token) {
      setSearchQuery(query)
      performSearch(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, token])

  useEffect(() => {
    if (!submittedQuery) return
    if (queryError) {
      setSearchResults([])
      setSearchError(
        (queryError as any)?.response?.status === 404
          ? 'No shipment found for that tracking ID.'
          : 'Something went wrong while searching. Please try again.'
      )
      return
    }
    if (searchData) {
      setSearchResults([searchData])
      setSearchError('')
      setRecentSearches(saveRecentSearch(submittedQuery) ?? recentSearches)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQuery, searchData, queryError])

  const performSearch = (query: string) => {
    const trackingId = query.trim()
    if (!trackingId || !token) return

    setSearchError('')
    setSubmittedQuery(trackingId)
  }

  const handleClearRecent = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(RECENT_SEARCHES_KEY)
    }
    setRecentSearches([])
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      // Update URL with search query
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
    performSearch(search)
    router.push(`/search?q=${encodeURIComponent(search)}`)
  }

  return (
    <UserAppLayout activeNav="home" showSearch={false}>
      <div className="p-4 lg:p-6 pb-20 lg:pb-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for tracking ID, orders, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:bg-white text-gray-900 placeholder:text-gray-500 font-[Urbanist] font-bold placeholder:font-bold"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                autoFocus
              />
            </div>
          </form>
        </div>

        {/* Search Content */}
        {searchQuery ? (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              Results for "{searchQuery}"
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4043FF] rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                            {result.tracking_id}
                          </h3>
                          <p className="text-sm text-gray-600 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                            {result.receiver_city ? `To ${result.receiver_city}` : 'Shipment details'}
                          </p>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                  {searchError || 'No results found'}
                </h3>
                <p className="text-gray-600 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                  Try searching for the exact tracking ID, e.g. ABC123XYZ456DEF
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Recent
              </h2>
              {recentSearches.length > 0 && (
                <button
                  onClick={handleClearRecent}
                  className="text-sm text-[#4043FF] font-bold hover:text-[#3333CC] font-[Urbanist]"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex items-center justify-between group"
                >
                  <span className="text-gray-700 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    {search}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </UserAppLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}