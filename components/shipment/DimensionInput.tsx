'use client'

import { InputRow } from '@/components/shipment/InputRow'
import { UnitSelect } from '@/components/shipment/UnitSelect'

export function DimensionInput({
    label,
    placeholder,
    value,
    onChange,
    unit,
    options,
    onUnitChange,
    sanitizeDecimal,
}: {
    label: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    unit: string
    options: ReadonlyArray<string>
    onUnitChange: (value: string) => void
    sanitizeDecimal: (value: string) => string
}) {
    return (
        <InputRow
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            type="text"
            inputMode="decimal"
            pattern="[0-9.]*"
            transform={sanitizeDecimal}
            suffix={
                <UnitSelect
                    value={unit}
                    options={options}
                    onChange={onUnitChange}
                />
            }
            suffixClassName="pr-1 text-gray-900"
        />
    )
}
