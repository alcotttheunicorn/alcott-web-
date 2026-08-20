'use client'

import { useState } from 'react'
import type { ZonePricing } from '@/lib/api/types'
import { AdminModal } from '@/components/admin/AdminModal'
import { SlabEditorTable } from './SlabEditorTable'

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

interface PricingZoneModalProps {
    isOpen: boolean
    onClose: () => void
    editingZone: ZonePricing | null
    onSave: (data: {
        zone_code: number
        base_country_code: string
        destination_country_codes: string[]
        import_slabs: { from_weight: number; to_weight: number; price: number }[]
        export_slabs: { from_weight: number; to_weight: number; price: number }[]
    }) => void
    isSaving: boolean
    formError: string
}

export function PricingZoneModal({ isOpen, onClose, editingZone, onSave, isSaving, formError }: PricingZoneModalProps) {
    const [zoneCode, setZoneCode] = useState(editingZone?.zone_code != null ? String(editingZone.zone_code) : '')
    const [baseCountry, setBaseCountry] = useState(editingZone?.base_country_code ?? 'NG')
    const [destinations, setDestinations] = useState((editingZone?.destination_country_codes ?? []).join(', '))
    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
    const [importSlabs, setImportSlabs] = useState<Slab[]>(payloadToSlabs(editingZone?.import_slabs))
    const [exportSlabs, setExportSlabs] = useState<Slab[]>(payloadToSlabs(editingZone?.export_slabs))

    const currentSlabs = activeTab === 'import' ? importSlabs : exportSlabs
    const setCurrentSlabs = activeTab === 'import' ? setImportSlabs : setExportSlabs

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            zone_code: Number(zoneCode),
            base_country_code: baseCountry,
            destination_country_codes: destinations.split(',').map((s) => s.trim()).filter(Boolean),
            import_slabs: slabsToPayload(importSlabs),
            export_slabs: slabsToPayload(exportSlabs),
        })
    }

    return (
        <AdminModal isOpen={isOpen} onClose={onClose} title={editingZone != null ? 'Edit Pricing Zone' : 'New Pricing Zone'}>
            <form onSubmit={handleSubmit} className="p-4 lg:p-6">
                {formError && <p className="mb-3 text-sm text-red-600 font-medium">{formError}</p>}

                <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-1">Zone Code</label>
                    <input
                        type="number"
                        value={zoneCode}
                        onChange={(e) => setZoneCode(e.target.value)}
                        placeholder="e.g. 6"
                        disabled={editingZone != null}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none disabled:bg-gray-100"
                    />
                </div>

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

                <div className="mb-4">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm font-medium text-gray-900">Price Slabs</span>
                        <button
                            type="button"
                            onClick={() => setCurrentSlabs([...currentSlabs, emptySlab()])}
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
                    <SlabEditorTable slabs={currentSlabs} onChange={setCurrentSlabs} />
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-[#4043FF] text-white font-semibold rounded-full hover:bg-[#3333CC] transition-colors text-sm disabled:opacity-60"
                >
                    {isSaving ? 'SAVING...' : 'SUBMIT'}
                </button>
            </form>
        </AdminModal>
    )
}
