'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Search } from 'lucide-react'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import LocationsMapWrapper from '@/components/locations/LocationsMapWrapper'
import type { DropCenterPoint } from '@/components/locations/LocationsMap'

interface DropCenter extends DropCenterPoint {
  name: string
  address: string
  phone: string
  distanceLabel: string
}

// Real Lagos drop-center coordinates + addresses. LAT/LNG are real and render
// on the map; distance is computed live from OSRM when directions run.
const DROP_CENTERS: DropCenter[] = [
  { id: 1, name: 'Alcott HQ Drop Center', address: '14 Admiralty Way, Lekki Phase 1, Lagos', lat: 6.4473, lng: 3.4758, phone: '+234 800 000 0000', distanceLabel: '' },
  { id: 2, name: 'Victoria Island DC', address: 'Adetokunbo Ademola Street, Victoria Island, Lagos', lat: 6.4276, lng: 3.4219, phone: '+234 800 000 0000', distanceLabel: '' },
  { id: 3, name: 'Ikeja DC', address: 'Obafemi Awolowo Way, Ikeja, Lagos', lat: 6.6059, lng: 3.3497, phone: '+234 800 000 0000', distanceLabel: '' },
  { id: 4, name: 'Yaba DC', address: 'Herbert Macaulay Way, Yaba, Lagos', lat: 6.5097, lng: 3.3767, phone: '+234 800 000 0000', distanceLabel: '' },
]

// Fallback "you are here" if geolocation is denied (Lekki coastline).
const DEFAULT_POSITION: [number, number] = [6.4288, 3.4703]

interface OSRMRoute {
  geometry: { coordinates: [number, number][] }
  distance: number
  duration: number
}

async function fetchOsrmRoute(origin: [number, number], dest: { lat: number; lng: number }): Promise<OSRMRoute | null> {
  try {
    const [olat, olng] = origin
    const url = `https://router.project-osrm.org/route/v1/driving/${olng},${olat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return data?.routes?.[0] ?? null
  } catch {
    return null
  }
}

function formatKm(meters: number) {
  const km = meters / 1000
  return km < 1 ? `${Math.round(meters)} m` : `${km.toFixed(1)} km`
}

export default function LocationsPage() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState(4)
  const [search, setSearch] = useState('')
  const [directionsStarted, setDirectionsStarted] = useState(false)
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [geolocationError, setGeolocationError] = useState(false)
  const [routeLine, setRouteLine] = useState<[number, number][] | null>(null)
  const [routeDistance, setRouteDistance] = useState<string | null>(null)
  const [routeDuration, setRouteDuration] = useState<string | null>(null)
  const [isRouting, setIsRouting] = useState(false)

  const getPosition = () => {
    if (typeof navigator === 'undefined') {
      setGeolocationError(true)
      return
    }
    if (!navigator.geolocation) {
      setGeolocationError(true)
      setUserPosition(DEFAULT_POSITION)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setGeolocationError(false)
        setUserPosition([p.coords.latitude, p.coords.longitude])
      },
      () => {
        setGeolocationError(true)
        setUserPosition(DEFAULT_POSITION)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    )
  }

  const selectedCenter = DROP_CENTERS.find((center) => center.id === selectedId) ?? DROP_CENTERS[0]
  const visibleCenters = useMemo(
    () => DROP_CENTERS.filter((center) => `${center.name} ${center.address}`.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  useEffect(() => {
    getPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleselect = (id: number) => {
    setSelectedId(id)
    setDirectionsStarted(false)
  }

  const handleDirection = async () => {
    setDirectionsStarted(true)
    if (!userPosition) {
      setRouteDistance(null)
      setRouteLine(null)
      return
    }
    setIsRouting(true)
    setRouteLine(null)
    setRouteDistance(null)
    setRouteDuration(null)
    const route = await fetchOsrmRoute(userPosition, { lat: selectedCenter.lat, lng: selectedCenter.lng })
    setIsRouting(false)
    if (!route) return
    setRouteLine(route.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]))
    setRouteDistance(formatKm(route.distance))
    setRouteDuration(`${Math.round(route.duration / 60)} min`)
  }

  return (
    <UserAppLayout activeNav="home" searchOnNavigateToSearchPage={false}>
      <div className="mx-auto w-full max-w-8xl px-4 py-5 lg:px-8 lg:py-7">
        <div className="mb-5 flex items-center gap-3">
          <button type="button" onClick={() => router.back()} aria-label="Go back" className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"><ArrowLeft className="h-4 w-4" /></button>
          <h1 className="text-lg font-bold text-gray-900">Nearby Drop Center</h1>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search drop centers" className="w-full rounded-lg border border-gray-100 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#4043FF]" />
        </div>

        {/* Real Leaflet map (client-only, dynamic import) */}
        <div className="relative h-76 overflow-hidden rounded-[20px] lg:h-[400px]">
          <LocationsMapWrapper
            centers={visibleCenters.map(({ id, name, lat, lng }) => ({ id, name, lat, lng }))}
            selectedId={selectedId}
            onSelect={handleselect}
            userPosition={userPosition}
            route={routeLine}
          />
          {geolocationError && userPosition && (
            <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#E4E5FF]/60 pointer-events-none">
              <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow">Location unavailable — showing default position</p>
            </div>
          )}
        </div>

        {directionsStarted && userPosition && (
          <div className="mt-4 rounded-xl bg-[#F4F5FF] p-4 text-center">
            {isRouting ? (
              <p className="text-sm font-semibold text-gray-700">Finding the best route…</p>
            ) : routeLine && routeDistance ? (
              <p className="text-sm font-semibold text-gray-700">
                <span className="text-[#4043FF]">{routeDistance}</span>
                {' · '}
                <span className="text-[#4043FF]">{routeDuration}</span>
                {' · drive from your location to '}<strong>{selectedCenter.name}</strong>
              </p>
            ) : (
              <p className="text-sm font-semibold text-gray-500">Could not compute a route for this destination.</p>
            )}
          </div>
        )}

        {directionsStarted ? (
          <div className="mt-6 flex justify-center">
            <button onClick={() => setDirectionsStarted(false)} className="w-full max-w-lg bg-[#4043FF] text-white rounded-full py-4 font-bold text-[16px] hover:bg-[#3333CC] transition-colors shadow-lg">
              Start Direction
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <section className="bg-white rounded-3xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {visibleCenters.map((center) => (
                <button key={center.id} type="button" onClick={() => handleselect(center.id)} className={`flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-gray-50 ${center.id === selectedId ? 'bg-[#F4F5FF]' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-[#E8E9FF] flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#4043FF"/>
                    </svg>
                  </div>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>{center.name}</strong>
                    <small className="block truncate text-[13px] font-medium text-gray-400 mt-0.5" style={{ fontFamily: "'Urbanist', sans-serif" }}>{center.address}</small>
                  </span>
                  <span className="shrink-0 text-[14px] font-bold text-[#4043FF]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                    {center.id === selectedId && routeDistance ? routeDistance : '—'}
                  </span>
                </button>
              ))}
              {visibleCenters.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No drop centers found.</p>}
            </section>

            <aside className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center flex flex-col items-center">
              <div className="h-16 w-16 mb-4 rounded-full bg-[#E8E9FF] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#4043FF"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>{selectedCenter.name}</h2>
              <p className="mt-2 text-[13px] font-medium text-gray-500 leading-relaxed max-w-[80%]" style={{ fontFamily: "'Urbanist', sans-serif" }}>{selectedCenter.address}</p>

              <div className="mt-6 flex items-center justify-center gap-4 text-[13px] font-medium text-[#4043FF]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                <span className="flex items-center gap-1.5 bg-[#F4F5FF] px-3 py-1.5 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  09:00 AM - 17:00 PM
                </span>
                <span className="flex items-center gap-1.5 bg-[#F4F5FF] px-3 py-1.5 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {routeDistance && selectedCenter.id === selectedId ? routeDistance : '—'} from you
                </span>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-[14px] font-bold text-gray-800" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                <Phone className="h-4 w-4 text-[#4043FF]" /> {selectedCenter.phone}
              </div>

              <div className="mt-8 flex w-full gap-4">
                <button
                  type="button"
                  onClick={getPosition}
                  className="flex-1 rounded-full bg-[#F4F5FF] text-[#4043FF] py-3.5 text-[15px] font-bold hover:bg-[#E8E9FF] transition-colors"
                  style={{ fontFamily: "'Urbanist', sans-serif" }}
                >
                  Locate Me
                </button>
                <button type="button" onClick={handleDirection} disabled={isRouting} className="flex-1 rounded-full bg-[#4043FF] text-white py-3.5 text-[15px] font-bold hover:bg-[#3333CC] transition-colors disabled:opacity-60" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  {isRouting ? 'Routing…' : 'Direction'}
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* OSM attribution */}
        <p className="mt-4 text-center text-xs text-gray-400" style={{ fontFamily: "'Urbanist', sans-serif" }}>
          Map data ©{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">OpenStreetMap</a>{' '}
          contributors · Directions by{' '}
          <a href="https://project-osrm.org" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">OSRM</a>
        </p>
      </div>
    </UserAppLayout>
  )
}