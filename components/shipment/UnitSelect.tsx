'use client'

export function UnitSelect({
    value,
    options,
    onChange,
}: {
    value: string
    options: ReadonlyArray<string>
    onChange: (value: string) => void
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="bg-transparent text-sm font-semibold text-gray-900 focus:outline-none focus:ring-0"
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option.toUpperCase()}
                </option>
            ))}
        </select>
    )
}
