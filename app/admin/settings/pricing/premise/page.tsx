'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { getPricingOverview, upsertPremisePricing } from '@/lib/api/pricing-api'

export default function PricingPremisePage() {
    const { token } = useAuth()
    const queryClient = useQueryClient()
    const [baseRangeCost, setBaseRangeCost] = useState('')
    const [costPerKM, setCostPerKM] = useState('')
    const [costPerMinute, setCostPerMinute] = useState('')
    const [costPerKG, setCostPerKG] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // /pricing/admin/premise has no GET of its own — the current values are
    // nested inside the /pricing/admin/overview response instead.
    const { data: overview, isLoading: loading, error: queryError } = useQuery({
        queryKey: ['pricing-overview', token],
        queryFn: () => getPricingOverview().then((res) => res.data),
        enabled: !!token,
    })

    // Seeds the editable form fields once when the overview data arrives —
    // this is the one legitimate use of an effect here, since it's syncing
    // server data into local editable state, not fetching.
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
            // Other pages (or this one, on remount) reading pricing-overview
            // should see the new values instead of a stale cache.
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
            {/* Page Header */}
            <div className="flex items-center gap-2 mb-8 lg:mb-10">
                <Link href="/admin/users" className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-sm lg:text-base font-bold text-gray-900 tracking-wide">PRICING PREMISE</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-2xl pl-4 lg:pl-8 pr-4 lg:pr-8 space-y-6 lg:space-y-8">
                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                    {successMessage && <p className="text-sm text-green-600 font-medium">{successMessage}</p>}

                    {/* Base Range Cost */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                        <label className="text-sm text-gray-700 font-medium w-32 shrink-0">Base Range Cost</label>
                        <div className="flex items-center gap-3 flex-1">
                            <input
                                type="text"
                                inputMode="decimal"
                                value={baseRangeCost}
                                onChange={(e) => setBaseRangeCost(e.target.value)}
                                className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                            />
                            <span className="text-sm text-gray-600 font-medium">NGN</span>
                        </div>
                    </div>

                    {/* Cost Per KM */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                        <label className="text-sm text-gray-700 font-medium w-32 shrink-0">Cost Per KM</label>
                        <div className="flex items-center gap-3 flex-1">
                            <input
                                type="text"
                                inputMode="decimal"
                                value={costPerKM}
                                onChange={(e) => setCostPerKM(e.target.value)}
                                className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                            />
                            <span className="text-sm text-gray-600 font-medium">NGN</span>
                        </div>
                    </div>

                    {/* Cost Per Minute */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                        <label className="text-sm text-gray-700 font-medium w-32 shrink-0">Cost Per Minute</label>
                        <div className="flex items-center gap-3 flex-1">
                            <input
                                type="text"
                                inputMode="decimal"
                                value={costPerMinute}
                                onChange={(e) => setCostPerMinute(e.target.value)}
                                className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                            />
                            <span className="text-sm text-gray-600 font-medium">NGN</span>
                        </div>
                    </div>

                    {/* Cost Per KG */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                        <label className="text-sm text-gray-700 font-medium w-32 shrink-0">Cost Per KG</label>
                        <div className="flex items-center gap-3 flex-1">
                            <input
                                type="text"
                                inputMode="decimal"
                                value={costPerKG}
                                onChange={(e) => setCostPerKG(e.target.value)}
                                className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                            />
                            <span className="text-sm text-gray-600 font-medium">NGN</span>
                        </div>
                    </div>

                    {/* Submit Button */}
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