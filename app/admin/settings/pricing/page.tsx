'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatCardSkeleton } from '@/components/shared/skeletons'
import {
    useExchangeRate,
    useImportPricingConfig,
    usePricingOverview,
    useUpdateExchangeRate,
} from '@/hooks/use-pricing'
import { toast } from '@/components/ui/use-toast'

function formatNaira(value: unknown) {
    const num = Number(value)
    if (!Number.isFinite(num)) return null
    return `₦${num.toLocaleString()}`
}

export default function PricingOverviewPage() {
    const { data: overview, isLoading: loading, error: queryError } = usePricingOverview()
    const { data: exchangeRate, isLoading: rateLoading } = useExchangeRate()
    const updateRateMutation = useUpdateExchangeRate()
    const importMutation = useImportPricingConfig()

    const [rateInput, setRateInput] = useState('')

    useEffect(() => {
        if (exchangeRate?.ngn_per_usd != null) setRateInput(String(exchangeRate.ngn_per_usd))
    }, [exchangeRate])

    const error = queryError
        ? ((queryError as any)?.response?.status === 403
            ? "You don't have admin access to pricing config."
            : 'Could not load pricing overview.')
        : ''

    const premise = overview?.premise as Record<string, unknown> | undefined
    const premiseRows = [
        { label: 'Base range cost', value: formatNaira(premise?.base_range_cost) },
        { label: 'Cost per km', value: formatNaira(premise?.cost_per_km) },
        { label: 'Cost per minute', value: formatNaira(premise?.cost_per_minute) },
        { label: 'Cost per kg', value: formatNaira(premise?.cost_per_kg) },
    ]

    const handleSaveRate = () => {
        const value = Number(rateInput.replace(/[,\s]/g, ''))
        if (!Number.isFinite(value) || value <= 0) {
            toast({ title: 'Invalid rate', description: 'Enter a positive NGN-per-USD rate.' })
            return
        }

        updateRateMutation.mutate(value, {
            onSuccess: (res) => toast({
                title: 'Exchange rate updated',
                description: res.data ? `Now ₦${res.data.ngn_per_usd.toLocaleString()} per $1.` : undefined,
            }),
            onError: (err: any) => toast({
                title: 'Update failed',
                description: err?.response?.data?.message || 'Could not update the exchange rate.',
            }),
        })
    }

    const handleImport = () => {
        if (!window.confirm('Re-import the pricing configuration? This may overwrite current pricing settings.')) return

        importMutation.mutate(undefined, {
            onSuccess: (res) => toast({ title: 'Import complete', description: res.message }),
            onError: (err: any) => toast({
                title: 'Import failed',
                description: err?.response?.data?.message || 'Could not import pricing config.',
            }),
        })
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            <AdminPageHeader title="PRICING OVERVIEW" backHref="/admin/users" />

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <EmptyState message={error} />
            ) : (
                <div className="space-y-6">
                    {/* Summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1">
                            <p className="text-xs text-gray-500 font-medium uppercase">Zones</p>
                            <p className="text-2xl font-bold text-gray-900">{overview?.zones ?? '—'}</p>
                            <Link href="/admin/settings/pricing/zones" className="text-xs text-[#4043FF] font-medium hover:underline mt-1">
                                Manage zones →
                            </Link>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1">
                            <p className="text-xs text-gray-500 font-medium uppercase">Regions</p>
                            <p className="text-2xl font-bold text-gray-900">{overview?.regions ?? '—'}</p>
                            <Link href="/admin/settings/pricing/regions" className="text-xs text-[#4043FF] font-medium hover:underline mt-1">
                                Manage regions →
                            </Link>
                        </div>

                        {/* Exchange rate — live edit via PUT /pricing/admin/exchange-rate */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
                            <p className="text-xs text-gray-500 font-medium uppercase">Exchange Rate</p>
                            {rateLoading ? (
                                <p className="text-2xl font-bold text-gray-300">—</p>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">
                                    {exchangeRate?.ngn_per_usd != null ? `₦${exchangeRate.ngn_per_usd.toLocaleString()}` : '—'}
                                    <span className="text-sm font-medium text-gray-500"> per $1</span>
                                </p>
                            )}
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={rateInput}
                                    onChange={(e) => setRateInput(e.target.value)}
                                    placeholder="NGN per USD"
                                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                                />
                                <button
                                    onClick={handleSaveRate}
                                    disabled={updateRateMutation.isPending}
                                    className="px-4 py-2 bg-[#4043FF] text-white text-sm font-semibold rounded-lg hover:bg-[#3333CC] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                                >
                                    {updateRateMutation.isPending ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Premise rates — read-only summary; editing lives on the Premise page */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-gray-500 font-medium uppercase">Premise Rates</p>
                            <Link href="/admin/settings/pricing/premise" className="text-xs text-[#4043FF] font-medium hover:underline">
                                Edit →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {premiseRows.map((row) => (
                                <div key={row.label}>
                                    <p className="text-xs text-gray-500">{row.label}</p>
                                    <p className="text-sm font-bold text-gray-900">{row.value ?? '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Config import — POST /pricing/admin/import */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-bold text-gray-900">Re-import pricing config</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Restores the default pricing configuration from the backend. This may overwrite current settings.
                            </p>
                        </div>
                        <button
                            onClick={handleImport}
                            disabled={importMutation.isPending}
                            className="px-4 py-2 border border-[#4043FF] text-[#4043FF] text-sm font-semibold rounded-lg hover:bg-[#4043FF] hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                        >
                            {importMutation.isPending ? 'Importing…' : 'Import'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
