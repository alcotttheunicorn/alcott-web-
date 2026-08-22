'use client'

import { useRef, useState } from 'react'
import { usePlaceAutocomplete, type PlacePrediction } from '@/hooks/use-place-autocomplete'
import { cn } from '@/lib/utils'

interface LocationAutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (prediction: PlacePrediction) => void
  placeholder?: string
  className?: string
  containerClassName?: string
  icon?: React.ReactNode
  country?: string
  style?: React.CSSProperties
}

// Drop-in replacement for a plain <input> address field — same value/onChange
// contract, plus a suggestions dropdown underneath. `icon` and `className`
// let each page keep its own visual style (left icon, border, padding etc);
// this component only adds the dropdown behavior on top.
export function LocationAutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
  containerClassName,
  icon,
  country,
  style,
}: LocationAutocompleteInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const { predictions, resetSession } = usePlaceAutocomplete(value, { country })
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const showDropdown = isFocused && predictions.length > 0

  const handleSelect = (prediction: PlacePrediction) => {
    onChange(prediction.fullText || `${prediction.mainText}, ${prediction.secondaryText}`)
    onSelect?.(prediction)
    resetSession()
    setIsFocused(false)
  }

  return (
    <div className={cn('relative', containerClassName)}>
      {icon}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
          setIsFocused(true)
        }}
        onBlur={() => {
          // Delay so a click on a suggestion registers before the dropdown unmounts.
          blurTimeoutRef.current = setTimeout(() => setIsFocused(false), 150)
        }}
        placeholder={placeholder}
        className={className}
        style={style}
        autoComplete="off"
      />

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden max-h-64 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.placeId}
              type="button"
              onClick={() => handleSelect(prediction)}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex flex-col"
            >
              <span className="text-sm font-medium text-gray-900">{prediction.mainText}</span>
              {prediction.secondaryText && (
                <span className="text-xs text-gray-500">{prediction.secondaryText}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}