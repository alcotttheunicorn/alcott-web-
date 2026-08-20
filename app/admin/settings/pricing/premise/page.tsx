'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { getPricingOverview, upsertPremisePricing } from '@/lib/api/pricing-api'
import { FormMessages } from '@/components/shared/FormMessages'
import { FormSkeleton } from '@/components/shared/skeletons'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { CostField } from '@/components/admin/CostField'

export default function PricingPremisePage() {
    const { token } = useAuth()
    const queryClient = useQueryClient()
    const [baseRangeCost, setBaseRangeCost] = useState('')
    const [costPerKM, setCostPerKM] = useState('')
    const [costPerMinute, setCostPerMinute] = useState('')
    const [costPerKG, setCostPerKG] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const { data: overview, isLoading: loading, error: queryError } = useQuery({
        queryKey: ['pricing-overview', token],
        queryFn: () => getPricingOverview().then((res) => res.data),
        enabled: !!token,
    })

    useEffect(() => {
        const premise = overview?.premise as Record<string, unknown> | undefined
        if (!premise) return
        if (premise.base_range_cost != null) setBaseRangeCost(String(premise.base_range_cost))
        if (premise.cost_per_km != null) setCostPerKM(String(premise.cost_per_km))
        if (premise.cost_per_minute != null) setCostPerMinute(String(premise.cost_per_minute))
        if (premise.cost_per_kg != null) setCostPerKG(String(premise.cost_per_kg))
    }, [overview])

    const error = queryError
        ? ((queryError as any)?.response?.status === 403 ? "You don't have admin access to pricing config." : 'Could not load current premise pricing.')
        : ''

    const mutation = useMutation({
        mutationFn: () =>
            upsertPremisePricing({
                base_range_cost: Number(baseRangeCost),
                cost_per_km: Number(costPerKM),
                cost_per_minute: Number(costPerMinute),
                cost_per_kg: Number(costPerKG),
            }),
        onSuccess: () => {
            setSuccessMessage('Premise pricing updated successfully.')
            queryClient.invalidateQueries({ queryKey: ['pricing-overview'] })
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSuccessMessage('')
        mutation.mutate()
    }

    const saving = mutation.isPending
    const submitError = mutation.error
        ? ((mutation.error as any)?.response?.data?.message ||
            ((mutation.error as any)?.response?.status === 403 ? "You don't have admin access to update pricing." : 'Could not update premise pricing.'))
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
                    <CostField label="Cost Per KM" value={costPerKM} onChange={setCostPerKM} />
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
