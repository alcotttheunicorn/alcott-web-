'use client'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

export interface DropCenterPoint {
  id: number
  name: string
  lat: number
  lng: number
}

interface LocationsMapProps {
  centers: DropCenterPoint[]
  selectedId: number
  onSelect: (id: number) => void
  userPosition: [number, number] | null
  route: [number, number][] | null
}

// Custom purple pin, matching the app's existing drop-center marker style.
// Uses a divIcon so no static icon assets are needed (avoids the Next.js
// Leaflet icon-path rewrite issue entirely).
function centerIcon(selected: boolean) {
  return L.divIcon({
    className: '',
    html: `
      <div style="width:64px;height:64px;display:flex;align-items:center;justify-content:center">
        <div style="width:64px;height:64px;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${selected ? 'rgba(64,67,255,0.15)' : 'rgba(64,67,255,0.05)'};animation:${selected ? 'locmap-pulse 1.6s ease-in-out infinite' : 'none'}">
          <div style="width:40px;height:40px;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${selected ? 'rgba(64,67,255,0.25)' : 'rgba(64,67,255,0.15)'}">
            <div style="width:20px;height:20px;border-radius:9999px;background:#4043FF;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.2)"></div>
          </div>
        </div>
      </div>`,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  })
}

function userIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center">
        <div style="width:48px;height:48px;border-radius:9999px;background:rgba(255,152,0,0.2);display:flex;align-items:center;justify-content:center;animation:locmap-pulse 1.6s ease-in-out infinite">
          <div style="width:24px;height:24px;border-radius:9999px;background:#FF9800;border:3px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.2)">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>
          </div>
        </div>
      </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  })
}

function FitBounds({ centers, selectedId, userPosition }: { centers: DropCenterPoint[]; selectedId: number; userPosition: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    const pts: L.LatLngExpression[] = centers.map((c) => [c.lat, c.lng])
    if (userPosition) pts.push(userPosition)
    if (pts.length > 0) map.fitBounds(L.latLngBounds(pts).pad(0.35), { animate: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, userPosition])
  return null
}

export default function LocationsMap({ centers, selectedId, onSelect, userPosition, route }: LocationsMapProps) {
  const selected = centers.find((c) => c.id === selectedId) ?? centers[0]
  return (
    <MapContainer
      center={[selected.lat, selected.lng]}
      zoom={11}
      zoomControl={true}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userPosition && <Marker position={userPosition} icon={userIcon()} />}
      {route && (
        <Polyline
          positions={route}
          pathOptions={{ color: '#4043FF', weight: 4, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
        />
      )}
      {centers.map((center) => (
        <Marker
          key={center.id}
          position={[center.lat, center.lng]}
          icon={centerIcon(center.id === selectedId)}
          eventHandlers={{ click: () => onSelect(center.id) }}
        />
      ))}
      <FitBounds centers={centers} selectedId={selectedId} userPosition={userPosition} />
    </MapContainer>
  )
}