'use client'

export function SummaryCard({ title, items }: { title: string; items: Array<[string, string]> }) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                {items.map(([label, value], index) => (
                    <div key={index} className="text-sm">
                        <p className="text-gray-500 font-medium">{label}</p>
                        <p className="text-gray-900 font-semibold mt-0.5">{value || '—'}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
