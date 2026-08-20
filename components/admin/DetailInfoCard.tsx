'use client'

interface DetailField {
    label: string
    value: string
}

interface DetailInfoCardProps {
    title: string
    fields: DetailField[]
}

export function DetailInfoCard({ title, fields }: DetailInfoCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            {fields.map((field, i) => (
                <div key={i} className={i < fields.length - 1 ? 'border-b border-gray-100 pb-3' : ''}>
                    <p className="text-xs text-gray-500">{field.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{field.value}</p>
                </div>
            ))}
        </div>
    )
}
