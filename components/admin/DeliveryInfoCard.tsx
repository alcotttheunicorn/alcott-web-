'use client'

interface DeliveryInfoCardProps {
    estDays: number
    estDate: string
}

export function DeliveryInfoCard({ estDays, estDate }: DeliveryInfoCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Delivery</h3>
                <button className="text-[#4043FF] text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    EDIT
                </button>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Est. Days</span>
                    <span className="text-sm font-semibold text-gray-900">{estDays || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Est. Date</span>
                    <span className="text-sm font-semibold text-gray-900">{estDate}</span>
                </div>
            </div>
        </div>
    )
}
