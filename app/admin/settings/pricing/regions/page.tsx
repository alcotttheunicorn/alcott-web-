'use client'

import { useState } from 'react'
import { useCreateRegionPricing, useRegionPricing, useUpdateRegionPricing } from '@/hooks/use-pricing'
import type { RegionPricing } from '@/lib/api/types'
import { ErrorBanner } from '@/components/shared/ErrorBanner'
import { EmptyState } from '@/components/shared/EmptyState'
import { ZoneGridSkeleton } from '@/components/shared/skeletons'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

function formatValue(value: unknown): string {
    if (value == null) return '—'
    if (Array.isArray(value)) return value.map(formatValue).join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
}

const mockZonedPrices = [
    { id: 1, zone: 'Zone 1', fromWeight: '5.5', toWeight: '6', price: '40,635' },
    { id: 2, zone: 'Zone 1', fromWeight: '5.5', toWeight: '6', price: '40,635' },
    { id: 3, zone: 'Zone 1', fromWeight: '5.5', toWeight: '6', price: '40,635' },
]

export default function PricingRegionsPage() {
    const { data: regions = [], isLoading: loading, error: queryError } = useRegionPricing()
    const updateMutation = useUpdateRegionPricing()
    const createMutation = useCreateRegionPricing()
    const [isCreating, setIsCreating] = useState(false)
    const [editingRegionId, setEditingRegionId] = useState<string | null>(null)
    const [regionName, setRegionName] = useState('')
    const [regionStates, setRegionStates] = useState('')
    const [formError, setFormError] = useState('')

    const error = queryError
        ? ((queryError as any)?.response?.status === 403 ? "You don't have admin access to pricing config." : 'Could not load regions.')
        : ''

    const startEditing = (region: RegionPricing) => {
        setIsCreating(false)
        setEditingRegionId(String(region.id ?? ''))
        setRegionName(String(region.name ?? ''))
        setRegionStates(Array.isArray(region.states) ? region.states.join(', ') : '')
        setFormError('')
    }

    const startCreating = () => {
        setIsCreating(true)
        setEditingRegionId(null)
        setRegionName('')
        setRegionStates('')
        setFormError('')
    }

    const cancelForm = () => {
        setIsCreating(false)
        setEditingRegionId(null)
        setFormError('')
    }

    const handleSave = (region?: RegionPricing) => {
        if (!regionName.trim()) {
            setFormError('Region name is required.')
            return
        }

        const states = regionStates.split(',').map((state) => state.trim()).filter(Boolean)
        setFormError('')
        const onSuccess = () => { setIsCreating(false); setEditingRegionId(null) }
        const onError = (mutationError: any) => setFormError(
            mutationError?.response?.data?.message ||
            (mutationError?.response?.status === 403 ? "You don't have admin access to update regions." : isCreating ? 'Could not create region.' : 'Could not update region.')
        )

        if (isCreating) {
            createMutation.mutate({ name: regionName.trim(), states }, { onSuccess, onError })
            return
        }

        const id = String(region?.id ?? '')
        if (!id) {
            setFormError('Region ID is required.')
            return
        }

        updateMutation.mutate({ id, name: regionName.trim(), states }, { onSuccess, onError })
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            <AdminPageHeader title="PRICING REGIONS" backHref="/admin/users">
                <button onClick={startCreating} className="flex items-center gap-2 text-[#4043FF] hover:text-[#3333CC] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">ADD REGION</span>
                </button>
            </AdminPageHeader>

            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900">REGIONS</h2>
                    <span className="text-gray-400 text-sm font-medium">EDIT EXISTING</span>
                </div>
                <p className="text-xs text-gray-400 mb-6">
                    Update a region name and replace its state list.
                </p>
                {formError && <p className="mb-4 text-sm text-red-600 font-medium">{formError}</p>}
                {isCreating && (
                    <form onSubmit={(event) => { event.preventDefault(); handleSave() }} className="mb-6 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">New Region</h3>
                        <div className="space-y-3">
                            <input value={regionName} onChange={(event) => setRegionName(event.target.value)} placeholder="Region name" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                            <input value={regionStates} onChange={(event) => setRegionStates(event.target.value)} placeholder="States, comma-separated" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                            <div className="flex gap-2">
                                <button type="submit" disabled={createMutation.isPending} className="rounded bg-[#4043FF] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">{createMutation.isPending ? 'SAVING...' : 'SAVE'}</button>
                                <button type="button" onClick={cancelForm} className="rounded border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700">CANCEL</button>
                            </div>
                        </div>
                    </form>
                )}

{loading ? (
    <ZoneGridSkeleton />
) : error ? (
                    <ErrorBanner message={error} />
                ) : regions.length === 0 ? (
                    <EmptyState message="No regions configured." className="border-0" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {regions.map((region, i) => {
                            const regionId = String(region.id ?? '')
                            const isEditing = editingRegionId === regionId

                            return (
                            <div key={regionId || i} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Region {i + 1}</h3>
                                {isEditing ? (
                                    <form onSubmit={(event) => { event.preventDefault(); handleSave(region) }} className="space-y-3">
                                        <input value={regionName} onChange={(event) => setRegionName(event.target.value)} placeholder="Region name" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                                        <input value={regionStates} onChange={(event) => setRegionStates(event.target.value)} placeholder="States, comma-separated" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                                        <div className="flex gap-2">
                                            <button type="submit" disabled={updateMutation.isPending} className="rounded bg-[#4043FF] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">{updateMutation.isPending ? 'SAVING...' : 'SAVE'}</button>
                                            <button type="button" onClick={() => setEditingRegionId(null)} className="rounded border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700">CANCEL</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <dl className="space-y-1.5 text-xs">
                                            {Object.entries(region).map(([key, value]) => (
                                                <div key={key} className="flex justify-between gap-3">
                                                    <dt className="text-gray-500 shrink-0">{key}</dt>
                                                    <dd className="text-gray-900 text-right break-words">{formatValue(value)}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                        <button type="button" onClick={() => startEditing(region)} className="mt-4 text-xs font-semibold text-[#4043FF]">EDIT REGION</button>
                                    </>
                                )}
                            </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mt-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900">Zoned Prices</h2>
                    <span className="text-gray-400 text-sm font-medium cursor-not-allowed" title="No backend endpoint for this yet">
                        ADD
                    </span>
                </div>
                <p className="text-xs text-gray-400 mb-6">Mock data — no backend endpoint exists for this yet.</p>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                                <th className="pb-3 font-medium"></th>
                                <th className="pb-3 font-medium">From Weight(KG)</th>
                                <th className="pb-3 font-medium">To Weight(KG)</th>
                                <th className="pb-3 font-medium">Price (NGN)</th>
                                <th className="pb-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockZonedPrices.map((price) => (
                                <tr key={price.id} className="border-b border-gray-100 last:border-0">
                                    <td className="py-3 text-sm text-gray-900">{price.zone}</td>
                                    <td className="py-3 text-sm text-gray-600">{price.fromWeight}</td>
                                    <td className="py-3 text-sm text-gray-600">{price.toWeight}</td>
                                    <td className="py-3 text-sm text-gray-900">{price.price}</td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2 justify-end opacity-40 cursor-not-allowed">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
