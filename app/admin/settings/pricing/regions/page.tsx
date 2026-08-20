'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { getRegionPricing } from '@/lib/api/pricing-api'
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
    const { token } = useAuth()

    const { data: regions = [], isLoading: loading, error: queryError } = useQuery({
        queryKey: ['pricing-regions', token],
        queryFn: () => getRegionPricing().then((res) => (Array.isArray(res.data) ? res.data : [])),
        enabled: !!token,
    })

    const error = queryError
        ? ((queryError as any)?.response?.status === 403 ? "You don't have admin access to pricing config." : 'Could not load regions.')
        : ''

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            <AdminPageHeader title="PRICING REGIONS" backHref="/admin/users" />

            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900">REGIONS</h2>
                    <span
                        className="text-gray-400 text-sm font-medium cursor-not-allowed"
                        title="No write endpoint (POST/PUT) has been documented for /pricing/admin/regions yet — read-only for now."
                    >
                        ADD
                    </span>
                </div>
                <p className="text-xs text-gray-400 mb-6">
                    Read-only — no write endpoint has been documented for regions yet.
                </p>

{loading ? (
    <ZoneGridSkeleton />
) : error ? (
                    <ErrorBanner message={error} />
                ) : regions.length === 0 ? (
                    <EmptyState message="No regions configured." className="border-0" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {regions.map((region, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Region {i + 1}</h3>
                                <dl className="space-y-1.5 text-xs">
                                    {Object.entries(region).map(([key, value]) => (
                                        <div key={key} className="flex justify-between gap-3">
                                            <dt className="text-gray-500 shrink-0">{key}</dt>
                                            <dd className="text-gray-900 text-right break-words">{formatValue(value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))}
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
