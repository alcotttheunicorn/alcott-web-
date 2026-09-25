'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, ChevronRight, MapPin, Navigation, Phone, Search } from 'lucide-react'
import { UserAppLayout } from '@/components/layout/UserAppLayout'

interface DropCenter {
  id: number
  name: string
  address: string
  distance: string
  phone: string
  position: string
}

const DROP_CENTERS: DropCenter[] = [
  { id: 1, name: 'Quincy Court DC', address: '77 Elgin Schmedeman Road', distance: '1.2 km', phone: '(503) 555-0105', position: '27% 35%' },
  { id: 2, name: 'Pearson Terrace DC', address: '922 Messerschmitt Circle', distance: '1.6 km', phone: '(503) 555-0112', position: '43% 25%' },
  { id: 3, name: 'Golf Course Alley DC', address: '762 Superior Road', distance: '2.1 km', phone: '(503) 555-0118', position: '58% 48%' },
  { id: 4, name: 'Moulton Lane DC', address: '84547 Lyons Center, New York, United States', distance: '2.3 km', phone: '(503) 555-0125', position: '72% 66%' },
]

function MapMarker({ center, selected, onClick }: { center: DropCenter; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={`Select ${center.name}`}
      onClick={onClick}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 ${selected ? 'z-20' : 'z-10'}`}
      style={{ left: center.position.split(' ')[0], top: center.position.split(' ')[1] }}
    >
      <span className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${selected ? 'bg-[#4043FF]/15 animate-pulse' : 'bg-[#4043FF]/5'}`}>
        <span className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${selected ? 'bg-[#4043FF]/25' : 'bg-[#4043FF]/15'}`}>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4043FF] border-2 border-white shadow-sm" />
        </span>
      </span>
    </button>
  )
}

function MapPanel({ selectedCenter, onSelect, directionsStarted }: { selectedCenter: DropCenter; onSelect: (center: DropCenter) => void; directionsStarted: boolean }) {
  return (
    <div className="relative h-76 overflow-hidden rounded-[20px] bg-[#E4E5FF] lg:h-[400px]">
      <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'linear-gradient(28deg, transparent 44%, rgba(255,255,255,.94) 44.5%, rgba(255,255,255,.94) 47%, transparent 47.5%), linear-gradient(116deg, transparent 38%, rgba(255,255,255,.92) 38.5%, rgba(255,255,255,.92) 41%, transparent 41.5%), linear-gradient(72deg, transparent 67%, rgba(255,255,255,.9) 67.5%, rgba(255,255,255,.9) 70%, transparent 70.5%), repeating-linear-gradient(8deg, transparent 0 30px, rgba(255,255,255,.8) 31px 35px), repeating-linear-gradient(96deg, transparent 0 42px, rgba(255,255,255,.7) 43px 47px)' }} />
      {DROP_CENTERS.map((center) => <MapMarker key={center.id} center={center} selected={center.id === selectedCenter.id} onClick={() => onSelect(center)} />)}
      
      {directionsStarted && (
        <>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Draw a fake path connecting a point to the selected center */}
            <path d={`M 31% 57% L ${selectedCenter.position.split(' ')[0]} ${selectedCenter.position.split(' ')[1]}`} stroke="#4043FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div className="absolute left-[31%] top-[57%] -translate-x-1/2 -translate-y-1/2 z-20">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF9800]/20 animate-pulse">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF9800] border-[3px] border-white shadow-md">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10"/></svg>
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default function LocationsPage() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState(4)
  const [search, setSearch] = useState('')
  const [directionsStarted, setDirectionsStarted] = useState(false)
  const selectedCenter = DROP_CENTERS.find((center) => center.id === selectedId) ?? DROP_CENTERS[0]
  const visibleCenters = useMemo(() => DROP_CENTERS.filter((center) => `${center.name} ${center.address}`.toLowerCase().includes(search.toLowerCase())), [search])

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

        <MapPanel selectedCenter={selectedCenter} directionsStarted={directionsStarted} onSelect={(center) => { setSelectedId(center.id); setDirectionsStarted(false) }} />

        {directionsStarted ? (
          <div className="mt-8 flex justify-center">
            <button onClick={() => setDirectionsStarted(false)} className="w-full max-w-lg bg-[#4043FF] text-white rounded-full py-4 font-bold text-[16px] hover:bg-[#3333CC] transition-colors shadow-lg">
              Start Direction
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <section className="bg-white rounded-3xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {visibleCenters.map((center) => (
                <button key={center.id} type="button" onClick={() => setSelectedId(center.id)} className={`flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-gray-50 ${center.id === selectedId ? 'bg-[#F4F5FF]' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-[#E8E9FF] flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#4043FF"/>
                    </svg>
                  </div>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>{center.name}</strong>
                    <small className="block truncate text-[13px] font-medium text-gray-400 mt-0.5" style={{ fontFamily: "'Urbanist', sans-serif" }}>{center.address}</small>
                  </span>
                  <span className="shrink-0 text-[14px] font-bold text-[#4043FF]" style={{ fontFamily: "'Urbanist', sans-serif" }}>{center.distance}</span>
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
                  {selectedCenter.distance} from you
                </span>
              </div>
              
              <div className="mt-5 flex items-center justify-center gap-2 text-[14px] font-bold text-gray-800" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                <Phone className="h-4 w-4 text-[#4043FF]" /> {selectedCenter.phone}
              </div>
              
              <div className="mt-8 flex w-full gap-4">
                <button type="button" className="flex-1 rounded-full bg-[#F4F5FF] text-[#4043FF] py-3.5 text-[15px] font-bold hover:bg-[#E8E9FF] transition-colors" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Call
                </button>
                <button type="button" onClick={() => setDirectionsStarted(true)} className="flex-1 rounded-full bg-[#4043FF] text-white py-3.5 text-[15px] font-bold hover:bg-[#3333CC] transition-colors" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Direction
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </UserAppLayout>
  )
}
