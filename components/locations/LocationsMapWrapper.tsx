'use client'

import dynamic from 'next/dynamic'
import type { DropCenterPoint } from './LocationsMap'

export interface LocationsMapWrapperProps {
  centers: DropCenterPoint[]
  selectedId: number
  onSelect: (id: number) => void
  userPosition: [number, number] | null
  route: [number, number][] | null
}

const LocationsMap = dynamic(() => import('./LocationsMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-[20px] bg-[#E4E5FF]" />
  ),
})

export default function LocationsMapWrapper(props: LocationsMapWrapperProps) {
  return <LocationsMap {...props} />
}