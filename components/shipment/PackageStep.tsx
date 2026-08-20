'use client'

import { useState } from 'react'
import { FormSection } from '@/components/shipment/FormSection'
import { InputRow } from '@/components/shipment/InputRow'
import { TextareaRow } from '@/components/shipment/TextareaRow'
import { ContinueButton } from '@/components/shipment/ContinueButton'
import { UnitSelect } from '@/components/shipment/UnitSelect'
import { DimensionInput } from '@/components/shipment/DimensionInput'
import { CaretDownIcon, MenuIcon } from '@/components/shipment/icons'
import { shippingOptions } from '@/lib/shipment-constants'
import type {
    ShipmentOption,
    ShipmentPackage,
    ShipmentWeightUnit,
    ShipmentDimensionUnit,
} from '@/lib/types/shipment-types'

interface PackageStepProps {
    data: ShipmentPackage
    onChange: (value: ShipmentPackage) => void
    shippingSelection: ShipmentOption
    onContinue: () => void
    canContinue: boolean
    weightUnits: ShipmentWeightUnit[]
    dimensionUnits: ShipmentDimensionUnit[]
    sanitizeDecimal: (value: string) => string
    categories: string[]
}

export function PackageStep({
    data,
    onChange,
    shippingSelection,
    onContinue,
    canContinue,
    weightUnits,
    dimensionUnits,
    sanitizeDecimal,
    categories,
}: PackageStepProps) {
    const [showOptions, setShowOptions] = useState(false)
    const [showCategoryOptions, setShowCategoryOptions] = useState(false)

    const handleWeightUnitChange = (unit: ShipmentWeightUnit) => {
        onChange({ ...data, weightUnit: unit })
    }

    const handleDimensionUnitChange = (unit: ShipmentDimensionUnit) => {
        onChange({ ...data, dimensionUnit: unit })
    }

    return (
        <FormSection title="Package Details" subtitle="Describe the package and choose shipping.">
            <div className="relative">
                <label className="text-sm font-semibold text-gray-700">Package Category</label>
                <button
                    type="button"
                    onClick={() => setShowCategoryOptions((prev) => !prev)}
                    className="mt-2 w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100"
                >
                    <span className={data.category ? 'text-gray-900' : 'text-gray-500'}>
                        {data.category || 'Select category'}
                    </span>
                    <CaretDownIcon className="w-4 h-4" />
                </button>
                {showCategoryOptions && (
                    <div className="absolute z-10 mt-2 w-full rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                        {categories.length === 0 && (
                            <p className="px-4 py-3 text-sm text-gray-400">No categories available</p>
                        )}
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    onChange({ ...data, category: cat })
                                    setShowCategoryOptions(false)
                                }}
                                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                                    data.category === cat ? 'bg-gray-50 font-semibold' : ''
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <TextareaRow label="Package Description" placeholder="Description" value={data.description} onChange={(value) => onChange({ ...data, description: value })} />
            <InputRow
                label="Weight"
                placeholder="Weight"
                value={data.weight}
                onChange={(value) => onChange({ ...data, weight: value })}
                type="text"
                inputMode="decimal"
                pattern="[0-9.]*"
                transform={sanitizeDecimal}
                suffix={
                    <UnitSelect
                        value={data.weightUnit}
                        options={weightUnits}
                        onChange={(unit) => handleWeightUnitChange(unit as ShipmentWeightUnit)}
                    />
                }
                suffixClassName="pr-1 text-gray-900"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <DimensionInput
                    label="Length"
                    placeholder="Length"
                    value={data.length}
                    onChange={(value) => onChange({ ...data, length: value })}
                    unit={data.dimensionUnit}
                    options={dimensionUnits}
                    onUnitChange={(unit) => handleDimensionUnitChange(unit as ShipmentDimensionUnit)}
                    sanitizeDecimal={sanitizeDecimal}
                />
                <DimensionInput
                    label="Width"
                    placeholder="Width"
                    value={data.width}
                    onChange={(value) => onChange({ ...data, width: value })}
                    unit={data.dimensionUnit}
                    options={dimensionUnits}
                    onUnitChange={(unit) => handleDimensionUnitChange(unit as ShipmentDimensionUnit)}
                    sanitizeDecimal={sanitizeDecimal}
                />
                <DimensionInput
                    label="Height"
                    placeholder="Height"
                    value={data.height}
                    onChange={(value) => onChange({ ...data, height: value })}
                    unit={data.dimensionUnit}
                    options={dimensionUnits}
                    onUnitChange={(unit) => handleDimensionUnitChange(unit as ShipmentDimensionUnit)}
                    sanitizeDecimal={sanitizeDecimal}
                />
            </div>
            <div className="relative">
                <label className="text-sm font-semibold text-gray-700">Select Shipping</label>
                <button
                    type="button"
                    onClick={() => setShowOptions((prev) => !prev)}
                    className="mt-2 w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100"
                >
                    <span className="flex items-center gap-1.5 whitespace-normal wrap-break-word text-left">
                        <MenuIcon className="w-4 h-4" />
                        {shippingSelection ? `${shippingSelection.label} – ₦${shippingSelection.price.toLocaleString()}` : 'Shipping'}
                    </span>
                    <CaretDownIcon className="w-4 h-4" />
                </button>
                {showOptions && (
                    <div className="absolute z-10 mt-2 w-full rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                        {shippingOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    onChange({ ...data, shippingOption: option.id })
                                    setShowOptions(false)
                                }}
                                className={`w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${
                                    data.shippingOption === option.id ? 'bg-gray-50' : ''
                                }`}
                            >
                                <div className="whitespace-normal wrap-break-word">
                                    <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                                    <p className="text-xs text-gray-500">{option.eta}</p>
                                </div>
                                <span className="text-sm font-bold text-[#4043FF]">₦{option.price.toLocaleString()}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <ContinueButton onClick={onContinue} label="Continue" disabled={!canContinue} />
        </FormSection>
    )
}
