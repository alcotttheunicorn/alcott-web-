'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { getZonePricing, upsertZonePricing } from '@/lib/api/pricing-api'
import type { ZonePricing } from '@/lib/api/types'

interface Slab {
    id: number
    from_weight: string
    to_weight: string
    price: string
}

function emptySlab(): Slab {
    return { id: Date.now() + Math.random(), from_weight: '0', to_weight: '0', price: '0' }
}

function slabsToPayload(slabs: Slab[]) {
    return slabs.map((s) => ({
        from_weight: Number(s.from_weight),
        to_weight: Number(s.to_weight),
        price: Number(s.price),
    }))
}

function payloadToSlabs(raw: Record<string, unknown>[] | undefined): Slab[] {
    if (!raw || raw.length === 0) return [emptySlab()]
    return raw.map((s) => ({
        id: Date.now() + Math.random(),
        from_weight: String(s.from_weight ?? '0'),
        to_weight: String(s.to_weight ?? '0'),
        price: String(s.price ?? '0'),
    }))
}

export default function PricingZonesPage() {
    const { token } = useAuth()
    const [zones, setZones] = useState<ZonePricing[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingZoneCode, setEditingZoneCode] = useState<number | null>(null)
    const [zoneCode, setZoneCode] = useState('')
    const [baseCountry, setBaseCountry] = useState('NG')
    const [destinations, setDestinations] = useState('') // comma-separated country codes
    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
    const [importSlabs, setImportSlabs] = useState<Slab[]>([emptySlab()])
    const [exportSlabs, setExportSlabs] = useState<Slab[]>([emptySlab()])
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')

    const loadZones = () => {
        if (!token) return
        setLoading(true)
        setError('')
        getZonePricing(token)
            .then((res) => setZones(Array.isArray(res.data) ? res.data : []))
            .catch((err) => {
                setZones([])
                setError(err?.response?.status === 403 ? "You don't have admin access to pricing config." : 'Could not load zones.')
            })
            .finally(() => setLoading(false))
    }

    useEffect(loadZones, [token])

    const openCreateModal = () => {
        setEditingZoneCode(null)
        setZoneCode('')
        setBaseCountry('NG')
        setDestinations('')
        setImportSlabs([emptySlab()])
        setExportSlabs([emptySlab()])
        setActiveTab('import')
        setFormError('')
        setIsModalOpen(true)
    }

    const openEditModal = (zone: ZonePricing) => {
        setEditingZoneCode(zone.zone_code ?? null)
        setZoneCode(zone.zone_code != null ? String(zone.zone_code) : '')
        setBaseCountry(zone.base_country_code ?? 'NG')
        setDestinations((zone.destination_country_codes ?? []).join(', '))
        setImportSlabs(payloadToSlabs(zone.import_slabs))
        setExportSlabs(payloadToSlabs(zone.export_slabs))
        setActiveTab('import')
        setFormError('')
        setIsModalOpen(true)
    }

    const currentSlabs = activeTab === 'import' ? importSlabs : exportSlabs
    const setCurrentSlabs = activeTab === 'import' ? setImportSlabs : setExportSlabs

    const handleAddPriceEntry = () => {
        setCurrentSlabs([...currentSlabs, emptySlab()])
    }

    const handleRemovePriceEntry = (id: number) => {
        setCurrentSlabs(currentSlabs.filter((entry) => entry.id !== id))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return
        if (!zoneCode.trim()) {
            setFormError('Zone code is required.')
            return
        }

        setSaving(true)
        setFormError('')
        try {
            await upsertZonePricing(token, {
                zone_code: Number(zoneCode),
                base_country_code: baseCountry,
                destination_country_codes: destinations.split(',').map((s) => s.trim()).filter(Boolean),
                import_slabs: slabsToPayload(importSlabs),
                export_slabs: slabsToPayload(exportSlabs),
            })
            setIsModalOpen(false)
            loadZones()
        } catch (err: any) {
            setFormError(
                err?.response?.data?.message ||
                (err?.response?.status === 403 ? "You don't have admin access to update pricing." : 'Could not save zone.')
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
                <div className="flex items-center gap-2">
                    <Link href="/admin/users" className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-sm lg:text-base font-bold text-gray-900 tracking-wide">PRICING ZONES</h1>
                </div>

                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 text-[#4043FF] hover:text-[#3333CC] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">ADD ZONE</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
                </div>
            ) : error ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">{error}</div>
            ) : zones.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                    No pricing zones configured yet. Click "ADD ZONE" to create one.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {zones.map((zone, i) => (
                        <div
                            key={zone.zone_code ?? i}
                            className="border border-gray-200 rounded-lg p-4 bg-white"
                        >
                            {/* Zone Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Zone {zone.zone_code ?? '—'}
                                </h3>
                                <button
                                    onClick={() => openEditModal(zone)}
                                    className="px-3 py-1 text-xs font-medium text-[#4043FF] border border-[#4043FF] rounded hover:bg-[#4043FF] hover:text-white transition-colors"
                                >
                                    EDIT
                                </button>
                            </div>

                            {/* Base Country */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Base Country</p>
                                <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded border border-gray-200">
                                    {zone.base_country_code ?? '—'}
                                </span>
                            </div>

                            {/* Destination Countries */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Destination Countries</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(zone.destination_country_codes ?? []).length === 0 ? (
                                        <span className="text-xs text-gray-400">None set</span>
                                    ) : zone.destination_country_codes!.map((country, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded border border-gray-200"
                                        >
                                            {country}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Import Prices */}
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Import Slabs</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {(zone.import_slabs ?? []).length === 0 ? (
                                        <span className="text-xs text-gray-400">None set</span>
                                    ) : zone.import_slabs!.map((slab, index) => (
                                        <div
                                            key={index}
                                            className="p-2 bg-gray-50 rounded border border-gray-200"
                                        >
                                            <p className="text-xs text-gray-600 mb-0.5">
                                                {String(slab.from_weight ?? '?')} - {String(slab.to_weight ?? '?')} (KG)
                                            </p>
                                            <p className="text-xs font-medium text-gray-900">
                                                NGN {Number(slab.price ?? 0).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pricing Zone Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-[#4043FF] px-4 py-3 flex items-center justify-between sticky top-0">
                            <h2 className="text-white font-semibold text-sm lg:text-base">
                                {editingZoneCode != null ? 'Edit Pricing Zone' : 'New Pricing Zone'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-4 lg:p-6">
                            {formError && <p className="mb-3 text-sm text-red-600 font-medium">{formError}</p>}

                            {/* Zone Code */}
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1">Zone Code</label>
                                <input
                                    type="number"
                                    value={zoneCode}
                                    onChange={(e) => setZoneCode(e.target.value)}
                                    placeholder="e.g. 6"
                                    disabled={editingZoneCode != null}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Base Country Code */}
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1">Base Country Code</label>
                                <input
                                    type="text"
                                    value={baseCountry}
                                    onChange={(e) => setBaseCountry(e.target.value.toUpperCase())}
                                    placeholder="NG"
                                    maxLength={2}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Destination Country Codes */}
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1">Destination Country Codes (comma-separated)</label>
                                <input
                                    type="text"
                                    value={destinations}
                                    onChange={(e) => setDestinations(e.target.value)}
                                    placeholder="GH, KE, ZA"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Prices Section */}
                            <div className="mb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-sm font-medium text-gray-900">Price Slabs</span>
                                    <button
                                        type="button"
                                        onClick={handleAddPriceEntry}
                                        className="p-1 bg-[#4043FF] rounded-full text-white hover:bg-[#3333CC] transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('import')}
                                        className={`text-xs font-medium ${activeTab === 'import' ? 'text-[#4043FF]' : 'text-gray-500'}`}
                                    >
                                        IMPORT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('export')}
                                        className={`text-xs font-medium ${activeTab === 'export' ? 'text-[#4043FF]' : 'text-gray-500'}`}
                                    >
                                        EXPORT
                                    </button>
                                </div>

                               
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-xs text-gray-500">
                                                <th className="text-left pb-2 font-medium">From Weight(KG)</th>
                                                <th className="text-left pb-2 font-medium">To Weight(KG)</th>
                                                <th className="text-left pb-2 font-medium">Price (NGN)</th>
                                                <th className="pb-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentSlabs.map((entry) => (
                                                <tr key={entry.id} className="border-t border-gray-100">
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="text"
                                                            value={entry.from_weight}
                                                            onChange={(e) => {
                                                                setCurrentSlabs(currentSlabs.map(p =>
                                                                    p.id === entry.id ? { ...p, from_weight: e.target.value } : p
                                                                ))
                                                            }}
                                                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                                        />
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="text"
                                                            value={entry.to_weight}
                                                            onChange={(e) => {
                                                                setCurrentSlabs(currentSlabs.map(p =>
                                                                    p.id === entry.id ? { ...p, to_weight: e.target.value } : p
                                                                ))
                                                            }}
                                                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                                        />
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="text"
                                                            value={entry.price}
                                                            onChange={(e) => {
                                                                setCurrentSlabs(currentSlabs.map(p =>
                                                                    p.id === entry.id ? { ...p, price: e.target.value } : p
                                                                ))
                                                            }}
                                                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                                        />
                                                    </td>
                                                    <td className="py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemovePriceEntry(entry.id)}
                                                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-3 bg-[#4043FF] text-white font-semibold rounded-full hover:bg-[#3333CC] transition-colors text-sm disabled:opacity-60"
                            >
                                {saving ? 'SAVING...' : 'SUBMIT'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}