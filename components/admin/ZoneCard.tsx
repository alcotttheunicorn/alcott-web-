'use client'

import type { ZonePricing } from '@/lib/api/types'
import { getCountryName } from '@/lib/countries'

interface ZoneCardProps {
    zone: ZonePricing
    index: number
    onEdit: (zone: ZonePricing) => void
}

function countryName(code?: string): string {
    return getCountryName(code ?? '')
}

export function ZoneCard({ zone, index, onEdit }: ZoneCardProps) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                    Zone {zone.zone_code ?? '—'}
                </h3>
                <button
                    onClick={() => onEdit(zone)}
                    className="px-3 py-1 text-xs font-medium text-[#4043FF] border border-[#4043FF] rounded hover:bg-[#4043FF] hover:text-white transition-colors"
                >
                    EDIT
                </button>
            </div>

            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Base Country</p>
                <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded border border-gray-200">
                    {countryName(zone.base_country_code)}
                </span>
            </div>

            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Destination Countries</p>
                <div className="flex flex-wrap gap-1.5">
                    {(zone.destination_country_codes ?? []).length === 0 ? (
                        <span className="text-xs text-gray-400">None set</span>
                    ) : zone.destination_country_codes!.map((country, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded border border-gray-200"
                        >
                            {countryName(country)}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-xs text-gray-500 mb-2">Import Slabs</p>
                <div className="grid grid-cols-2 gap-2">
                    {(zone.import_slabs ?? []).length === 0 ? (
                        <span className="text-xs text-gray-400">None set</span>
                    ) : zone.import_slabs!.map((slab, i) => (
                        <div
                            key={i}
                            className="p-2 bg-gray-50 rounded border border-gray-200"
                        >
                            <p className="text-xs text-gray-600 mb-0.5">
                                {String(slab.min_weight ?? '?')} - {String(slab.max_weight ?? '?')} (KG)
                            </p>
                            <p className="text-xs font-medium text-gray-900">
                                NGN {Number(slab.price ?? 0).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
