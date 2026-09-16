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
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 ${selected ? 'z-20 scale-110' : 'z-10'}`}
      style={{ left: center.position.split(' ')[0], top: center.position.split(' ')[1] }}
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${selected ? 'bg-[#4043FF]/25' : 'bg-[#7C7FFF]/25'}`}>
        <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow ${selected ? 'bg-[#F59E0B]' : 'bg-[#5B5EFF]'}`}>
          {selected ? <Check className="h-3 w-3 text-white" /> : <MapPin className="h-3 w-3 text-white" />}
        </span>
      </span>
    </button>
  )
}

function MapPanel({ selectedCenter, onSelect }: { selectedCenter: DropCenter; onSelect: (center: DropCenter) => void }) {
  return (
    <div className="relative h-76 overflow-hidden rounded-xl border border-[#D9DAFF] bg-[#E4E5FF] shadow-inner lg:h-100">
      <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'linear-gradient(28deg, transparent 44%, rgba(255,255,255,.94) 44.5%, rgba(255,255,255,.94) 47%, transparent 47.5%), linear-gradient(116deg, transparent 38%, rgba(255,255,255,.92) 38.5%, rgba(255,255,255,.92) 41%, transparent 41.5%), linear-gradient(72deg, transparent 67%, rgba(255,255,255,.9) 67.5%, rgba(255,255,255,.9) 70%, transparent 70.5%), repeating-linear-gradient(8deg, transparent 0 30px, rgba(255,255,255,.8) 31px 35px), repeating-linear-gradient(96deg, transparent 0 42px, rgba(255,255,255,.7) 43px 47px)' }} />
      <div className="absolute left-[8%] top-[52%] h-16 w-16 rounded-full border-10 border-white/90 bg-[#D4D5FF]" />
      <div className="absolute right-[9%] top-[67%] h-14 w-14 rounded-full border-[9px] border-white/90 bg-[#D4D5FF]" />
      <div className="absolute left-[30%] top-[56%] h-20 w-20 rounded-full bg-[#9A9DFF]/30" />
      <div className="absolute left-[31%] top-[57%] h-3 w-3 rounded-full bg-[#3336D8] ring-4 ring-white/80" />
      {DROP_CENTERS.map((center) => <MapMarker key={center.id} center={center} selected={center.id === selectedCenter.id} onClick={() => onSelect(center)} />)}
      <div className="absolute left-[31%] top-[57%] h-0.5 w-[39%] origin-left bg-[#4043FF]" style={{ transform: 'rotate(18deg)' }} />
      <div className="absolute left-[31%] top-[57%] h-0.5 w-[25%] origin-left bg-[#4043FF]" style={{ transform: 'rotate(-43deg)' }} />
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

        <MapPanel selectedCenter={selectedCenter} onSelect={(center) => { setSelectedId(center.id); setDirectionsStarted(false) }} />

        {directionsStarted ? (
          <section className="mt-5 rounded-xl border border-[#D9DAFF] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Navigation className="h-4 w-4 text-[#4043FF]" /> Route to {selectedCenter.name}</div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#E4E5FF]"><div className="h-full w-1/3 rounded-full bg-[#4043FF]" /></div>
            <p className="mt-2 text-xs text-gray-500">Follow the highlighted route for approximately {selectedCenter.distance}.</p>
          </section>
        ) : (
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <section className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white shadow-sm">
              {visibleCenters.map((center) => (
                <button key={center.id} type="button" onClick={() => setSelectedId(center.id)} className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-[#F7F7FF] ${center.id === selectedId ? 'bg-[#F7F7FF]' : ''}`}>
                  <MapPin className="h-4 w-4 shrink-0 text-[#4043FF]" />
                  <span className="min-w-0 flex-1"><strong className="block truncate text-xs text-gray-900">{center.name}</strong><small className="block truncate text-[10px] text-gray-500">{center.address}</small></span>
                  <span className="shrink-0 text-[10px] font-semibold text-[#4043FF]">{center.distance}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </button>
              ))}
              {visibleCenters.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No drop centers found.</p>}
            </section>

            <aside className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8E8FF] text-[#4043FF]"><MapPin className="h-5 w-5" /></div>
              <h2 className="text-sm font-bold text-gray-900">{selectedCenter.name}</h2>
              <p className="mt-1 text-[10px] leading-4 text-gray-500">{selectedCenter.address}</p>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gray-600"><span>◷ 09:00 AM - 17:00 PM</span><span>•</span><span>{selectedCenter.distance} from you</span></div>
              <p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-gray-800"><Phone className="h-3.5 w-3.5 text-[#4043FF]" /> {selectedCenter.phone}</p>
              <button type="button" onClick={() => setDirectionsStarted(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#4043FF] py-2.5 text-xs font-bold text-white hover:bg-[#3333CC]"> <Navigation className="h-3.5 w-3.5" /> Direction</button>
            </aside>
          </div>
        )}
      </div>
    </UserAppLayout>
  )
}
