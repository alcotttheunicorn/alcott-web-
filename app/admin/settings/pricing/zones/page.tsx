'use client'

import { useState } from 'react'
import { useCreateZonePricing, useReplaceZonePricing, useUpdateZonePricing, useZonePricing } from '@/hooks/use-pricing'
import type { ZonePricing } from '@/lib/api/types'
import { EmptyState } from '@/components/shared/EmptyState'
import { ZoneGridSkeleton } from '@/components/shared/skeletons'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ZoneCard } from '@/components/admin/ZoneCard'
import { PricingZoneModal } from '@/components/admin/PricingZoneModal'

export default function PricingZonesPage() {
    const { data: zones = [], isLoading: loading, error: queryError } = useZonePricing()
    const createMutation = useCreateZonePricing()
    const updateMutation = useUpdateZonePricing()
    const replaceMutation = useReplaceZonePricing()

    const error = queryError
        ? ((queryError as any)?.response?.status === 403 ? "You don't have admin access to pricing config." : 'Could not load zones.')
        : ''

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingZone, setEditingZone] = useState<ZonePricing | null>(null)
    const [formError, setFormError] = useState('')

    const saving = createMutation.isPending || updateMutation.isPending || replaceMutation.isPending

    const handleOpenCreate = () => {
        setEditingZone(null)
        setFormError('')
        setIsModalOpen(true)
    }

    const handleOpenEdit = (zone: ZonePricing) => {
        setEditingZone(zone)
        setFormError('')
        setIsModalOpen(true)
    }

    const handleSave = (data: any, mode: 'update' | 'replace' = 'update') => {
        setFormError('')
        const handleError = (err: any) => setFormError(
            err?.response?.data?.message ||
            (err?.response?.status === 403 ? "You don't have admin access to update pricing." : 'Could not save zone.')
        )

        if (editingZone?.zone_code == null) {
            createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false), onError: handleError })
            return
        }

        // Replace sends the complete zone object via PUT and overwrites every
        // field; update PATCHes just the edited fields.
        if (mode === 'replace') {
            replaceMutation.mutate(data, { onSuccess: () => setIsModalOpen(false), onError: handleError })
            return
        }

        const { zone_code, ...zonePatch } = data
        updateMutation.mutate({ code: zone_code, zone: zonePatch }, { onSuccess: () => setIsModalOpen(false), onError: handleError })
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            <AdminPageHeader title="PRICING ZONES" backHref="/admin/users">
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 text-[#4043FF] hover:text-[#3333CC] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">ADD ZONE</span>
                </button>
            </AdminPageHeader>

{loading ? (
    <ZoneGridSkeleton />
) : error ? (
                <EmptyState message={error} />
            ) : zones.length === 0 ? (
                <EmptyState message='No pricing zones configured yet. Click "ADD ZONE" to create one.' />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {zones.map((zone: ZonePricing, i: number) => (
                        <ZoneCard key={zone.zone_code ?? i} zone={zone} index={i} onEdit={handleOpenEdit} />
                    ))}
                </div>
            )}

            {/* key remounts the modal per zone/create so form state never
                leaks from a previously edited zone into the next one. */}
            <PricingZoneModal
                key={editingZone?.zone_code ?? 'new'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingZone={editingZone}
                onSave={handleSave}
                isSaving={saving}
                formError={formError}
            />
        </div>
    )
}
