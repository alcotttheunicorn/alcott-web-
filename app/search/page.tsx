'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useShipmentByTrackingId } from '@/hooks/use-shipments'
import type { ShipmentData } from '@/lib/api/types'

export const dynamic = 'force-dynamic'

const RECENT_SEARCHES_KEY = 'alcott.recentTrackingSearches'
const MAX_RECENT_SEARCHES = 7

interface TrackingEvent {
  id?: string
  event_name?: string
  event?: string
  status?: string
  location?: string
  created_at?: string
  timestamp?: string
}

function trackingEvents(shipment: ShipmentData): TrackingEvent[] {
  const record = shipment as ShipmentData & Record<string, unknown>
  const rawEvents = record.event_logs ?? record.events ?? record.shipment_events
  if (!Array.isArray(rawEvents)) return []
  return rawEvents
    .filter((event): event is TrackingEvent => Boolean(event) && typeof event === 'object')
    .sort((left, right) => {
      const leftTime = new Date(left.created_at ?? left.timestamp ?? 0).getTime()
      const rightTime = new Date(right.created_at ?? right.timestamp ?? 0).getTime()
      return rightTime - leftTime
    })
}

function formatDate(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function formatDeliveryDate(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function readableStatus(status?: string) {
  return (status || 'IN TRANSIT').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusColor(status?: string) {
  switch ((status || '').toUpperCase()) {
    case 'DELIVERED': return 'bg-emerald-100 text-emerald-800'
    case 'CANCELLED':
    case 'FAILED': return 'bg-rose-100 text-rose-800'
    case 'UNPAID': return 'bg-amber-100 text-amber-800'
    default: return 'bg-blue-100 text-blue-800'
  }
}

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
    const query = searchParams.get('tracking-id') || searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    if (!submittedQuery) return
    if (queryError) {
      setSearchResults([])
      setSearchError(
        (queryError as any)?.response?.status === 404
          ? 'No shipment found for that tracking ID.'
          : (queryError as any)?.response?.status === 401
            ? 'Public tracking is not available for this shipment yet. Please contact Alcott support.'
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
    if (!trackingId) return

    setSearchError('')
    setSearchResults([])
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
      router.push(`/search?tracking-id=${encodeURIComponent(searchQuery.trim())}&submit=1`)
    }
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
    performSearch(search)
    router.push(`/search?tracking-id=${encodeURIComponent(search)}&submit=1`)
  }

  return (
    <main className="min-h-screen bg-[#F5F8FA] text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Alcott home"><img src="/alcott-small.png" alt="Alcott" className="h-8 w-auto" /></Link>
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-[#4043FF]">Home</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#4043FF]">Alcott tracking</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">Track your shipment</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">Enter your tracking number to see the latest shipment status and delivery progress.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-8 flex max-w-4xl flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:p-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Enter tracking number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Tracking number"
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-[#4043FF]/20 sm:min-w-[22rem]"
                autoFocus
              />
            </div>
            <button type="submit" disabled={!searchQuery.trim() || isLoading} className="h-12 rounded-lg bg-[#4043FF] px-7 text-sm font-bold text-white hover:bg-[#3333CC] disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? 'Searching…' : 'Track shipment'}
            </button>
        </form>

        {/* Search Content */}
        {submittedQuery ? (
          <section aria-live="polite">
            {isLoading ? (
              <div className="flex max-w-4xl items-center gap-3 rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-600">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4043FF] border-t-transparent" /> Looking up {submittedQuery}…
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-w-4xl space-y-4">
                {searchResults.map((result) => (
                  <TrackingResult key={result.id || result.tracking_id || submittedQuery} shipment={result} />
                ))}
              </div>
            ) : (
              <div className="max-w-4xl rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
                <h2 className="text-lg font-bold text-gray-900">{searchError || 'No shipment found'}</h2>
                <p className="mt-2 text-sm text-gray-600">
                  {(queryError as any)?.response?.status === 401
                    ? 'Tracking details are currently unavailable. Please try again later or contact Alcott support.'
                    : 'Check the tracking number and try again. Tracking numbers can contain letters or digits.'}
                </p>
              </div>
            )}
          </section>
        ) : (
          <section className="max-w-4xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700">Recent tracking numbers</h2>
              {recentSearches.length > 0 && (
                <button
                  onClick={handleClearRecent}
                  className="text-xs font-semibold text-[#4043FF] hover:text-[#3333CC]"
                >
                  Clear history
                </button>
              )}
            </div>

            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-gray-700">
                    {search}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
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

function TrackingResult({ shipment }: { shipment: ShipmentData }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview')
  const events = trackingEvents(shipment)
  const estimate = formatDeliveryDate(shipment.estimated_delivery_date) || 'Not available yet'
  const latestEvent = events[0]
  const createdDate = formatDate(shipment.created_at)

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tracking number</p>
            <h2 className="mt-1 text-xl font-bold tracking-wide text-gray-950">{shipment.tracking_id || 'Tracking update'}</h2>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusColor(shipment.status)}`}>{readableStatus(shipment.status)}</span>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">From</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{shipment.sender_city || 'Origin pending'}</p>
          </div>
          <div className="hidden h-px w-16 bg-gray-300 sm:block" aria-hidden="true" />
          <div className="sm:text-right">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">To</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{shipment.receiver_city || 'Destination pending'}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
          <div>
              <p className="text-xs text-gray-500">Estimated delivery</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{estimate}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-gray-500">Latest scan</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{latestEvent?.event_name || latestEvent?.event || 'No scan recorded yet'}</p>
            <p className="mt-0.5 text-xs text-gray-500">{latestEvent?.location ? `${latestEvent.location} · ` : ''}{formatDate(latestEvent?.created_at || latestEvent?.timestamp) || 'Awaiting first scan'}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 px-5 sm:px-7">
        <div className="flex gap-6" role="tablist" aria-label="Tracking details">
          {(['overview', 'timeline'] as const).map((tab) => (
            <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`border-b-2 py-3 text-sm font-semibold capitalize ${activeTab === tab ? 'border-[#4043FF] text-[#4043FF]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              {tab === 'timeline' ? 'Shipment timeline' : 'Shipment details'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' ? (
        <dl className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">
          <div><dt className="text-xs text-gray-500">Service status</dt><dd className="mt-1 text-sm font-semibold text-gray-900">{readableStatus(shipment.status)}</dd></div>
          <div><dt className="text-xs text-gray-500">Package</dt><dd className="mt-1 text-sm font-semibold text-gray-900">{shipment.package_category || 'Shipment'}{shipment.package_weight ? ` · ${shipment.package_weight} kg` : ''}</dd></div>
          <div><dt className="text-xs text-gray-500">Booked</dt><dd className="mt-1 text-sm font-semibold text-gray-900">{createdDate || '—'}</dd></div>
        </dl>
      ) : (
        <div className="p-5 sm:p-7">
          {events.length ? (
            <ol className="space-y-0">
              {events.map((event, index) => (
                <li key={event.id || `${event.created_at}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < events.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-gray-200" aria-hidden="true" />}
                  <span className={`relative mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-white ${index === 0 ? 'bg-[#4043FF]' : 'bg-gray-300'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{event.event_name || event.event || event.status || 'Shipment update'}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(event.created_at || event.timestamp)}{event.location ? ` · ${event.location}` : ''}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-600">Shipment scans will appear here as the parcel moves through the network.</p>
          )}
        </div>
      )}
    </article>
  )
}