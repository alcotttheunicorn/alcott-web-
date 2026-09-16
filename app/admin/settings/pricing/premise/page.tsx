'use client'

import { useEffect, useState } from 'react'
import { usePremisePricing, useUpsertPremisePricing } from '@/hooks/use-pricing'
import { FormMessages } from '@/components/shared/FormMessages'
import { FormSkeleton } from '@/components/shared/skeletons'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { CostField } from '@/components/admin/CostField'

export default function PricingPremisePage() {
    const { data: premise, isLoading: loading, error: queryError } = usePremisePricing()
    const [baseRangeCost, setBaseRangeCost] = useState('')
    const [costPerKm, setCostPerKm] = useState('')
    const [costPerMinute, setCostPerMinute] = useState('')
    const [costPerKG, setCostPerKG] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (!premise) return
        if (premise.base_range_cost != null) setBaseRangeCost(String(premise.base_range_cost))
        if (premise.cost_per_km != null) setCostPerKm(String(premise.cost_per_km))
        if (premise.cost_per_minute != null) setCostPerMinute(String(premise.cost_per_minute))
        if (premise.cost_per_kg != null) setCostPerKG(String(premise.cost_per_kg))
    }, [premise])

    const error = queryError
        ? ((queryError as any)?.response?.status === 403 ? "You don't have admin access to pricing config." : 'Could not load current premise pricing.')
        : ''

    const upsertMutation = useUpsertPremisePricing()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSuccessMessage('')
        upsertMutation.mutate(
            {
                base_range_cost: Number(baseRangeCost),
                cost_per_km: Number(costPerKm),
                cost_per_minute: Number(costPerMinute),
                cost_per_kg: Number(costPerKG),
            },
            {
                onSuccess: () => setSuccessMessage('Premise pricing updated successfully.'),
            },
        )
    }

    const saving = upsertMutation.isPending
    const submitError = upsertMutation.error
        ? ((upsertMutation.error as any)?.response?.data?.message ||
            ((upsertMutation.error as any)?.response?.status === 403 ? "You don't have admin access to update pricing." : 'Could not update premise pricing.'))
        : ''

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            <AdminPageHeader title="PRICING PREMISE" backHref="/admin/users" />

{loading ? (
    <FormSkeleton />
) : (
                <form onSubmit={handleSubmit} className="max-w-2xl pl-4 lg:pl-8 pr-4 lg:pr-8 space-y-6 lg:space-y-8">
                    <FormMessages error={error || submitError} success={successMessage} />

                    <CostField label="Base Range Cost" value={baseRangeCost} onChange={setBaseRangeCost} />
                    <CostField label="Cost Per KM" value={costPerKm} onChange={setCostPerKm} />
                    <CostField label="Cost Per Minute" value={costPerMinute} onChange={setCostPerMinute} />
                    <CostField label="Cost Per KG" value={costPerKG} onChange={setCostPerKG} />

                    <div className="pt-4 lg:pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto sm:min-w-[300px] py-3 px-8 bg-[#4043FF] text-white font-semibold rounded-full hover:bg-[#3333CC] transition-colors text-sm disabled:opacity-60"
                        >
                            {saving ? 'SAVING...' : 'SUBMIT'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
