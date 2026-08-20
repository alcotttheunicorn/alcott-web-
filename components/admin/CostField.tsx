'use client'

interface CostFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    suffix?: string
}

export function CostField({ label, value, onChange, suffix = 'NGN' }: CostFieldProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
            <label className="text-sm text-gray-700 font-medium w-32 shrink-0">{label}</label>
            <div className="flex items-center gap-3 flex-1">
                <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                />
                <span className="text-sm text-gray-600 font-medium">{suffix}</span>
            </div>
        </div>
    )
}
