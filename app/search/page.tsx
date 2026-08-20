'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Package, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { SearchResultSkeleton } from '@/components/shared/skeletons'
import { useAuth } from '@/hooks/use-auth'
import { getShipmentByTrackingId } from '@/lib/api/shipment-api'
import type { ShipmentData } from '@/lib/api/types'

const STORAGE_KEY = 'alcott.recentTrackingSearches'
const getRecents = () => typeof window === 'undefined' ? [] : JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]

function SearchContent() {
  const router = useRouter(); const params = useSearchParams(); const { token } = useAuth(); const [query, setQuery] = useState(''); const [recents, setRecents] = useState<string[]>([]); const [results, setResults] = useState<ShipmentData[]>([]); const [error, setError] = useState('')
  const search = useMutation({ mutationFn: getShipmentByTrackingId, onSuccess: (response) => setResults(response.data ? [response.data] : []), onError: () => { setResults([]); setError('No shipment found for that tracking ID.') } })
  const submit = (value: string) => { const tracking = value.trim(); if (!tracking || !token) return; setError(''); search.mutate(tracking); const updated = [tracking, ...getRecents().filter((item) => item.toLowerCase() !== tracking.toLowerCase())].slice(0, 7); window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); setRecents(updated); router.replace(`/search?q=${encodeURIComponent(tracking)}`) }
  useEffect(() => { setRecents(getRecents()); const value = params.get('q'); if (value && token) { setQuery(value); search.mutate(value) } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, token])
  return <UserAppLayout contentBgClass="bg-[#F8F9FA]"><div className="max-w-4xl mx-auto p-4 lg:p-6"><form onSubmit={(event: FormEvent) => { event.preventDefault(); submit(query) }} className="flex gap-2 mb-8"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enter tracking ID" className="flex-1 px-4 py-3 rounded-lg border border-gray-300" /><button className="px-5 rounded-lg bg-[#4043FF] text-white"><Search className="w-5 h-5" /></button></form>{query ? <section><h1 className="text-xl font-bold mb-4">Results for “{query}”</h1>{search.isPending ? <div className="space-y-3">{[1, 2].map((n) => <SearchResultSkeleton key={n} />)}</div> : results.map((shipment) => <article key={shipment.id} className="bg-white rounded-xl border p-4 flex justify-between"><div className="flex gap-3"><Package className="w-6 h-6 text-[#4043FF]" /><div><h2 className="font-bold">{shipment.tracking_id}</h2><p className="text-sm text-gray-500">{shipment.receiver_city ? `To ${shipment.receiver_city}` : 'Shipment details'}</p></div></div><span className="text-sm font-semibold">{shipment.status}</span></article>)}{!search.isPending && !results.length && <p className="text-center text-gray-500 py-10">{error || 'No results found'}</p>}</section> : <section><div className="flex justify-between mb-3"><h1 className="text-xl font-bold">Recent searches</h1>{recents.length > 0 && <button onClick={() => { window.localStorage.removeItem(STORAGE_KEY); setRecents([]) }} className="text-[#4043FF]">Clear all</button>}</div>{recents.map((item) => <button key={item} onClick={() => { setQuery(item); submit(item) }} className="block w-full text-left bg-white border rounded-lg p-4 mb-2">{item}</button>)}</section>}</div></UserAppLayout>
}
export default function SearchPage() { return <Suspense fallback={null}><SearchContent /></Suspense> }
