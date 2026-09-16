'use client'

import { useEffect, useId, useRef, useState } from 'react'
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const listboxId = useId()
  const { predictions, loading, resetSession } = usePlaceAutocomplete(value, { country })
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const showDropdown = isFocused && (loading || predictions.length > 0)

  useEffect(() => {
    setHighlightedIndex(-1)
  }, [predictions])

  const handleSelect = (prediction: PlacePrediction) => {
    onChange(prediction.fullText || `${prediction.mainText}, ${prediction.secondaryText}`)
    onSelect?.(prediction)
    resetSession()
    setIsFocused(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsFocused(false)
      setHighlightedIndex(-1)
      return
    }

    if (!predictions.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((current) => (current + 1) % predictions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((current) => (current - 1 + predictions.length) % predictions.length)
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault()
      handleSelect(predictions[highlightedIndex])
    }
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
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls={showDropdown ? listboxId : undefined}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <div id={listboxId} role="listbox" className="absolute z-20 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden max-h-64 overflow-y-auto">
          {loading && predictions.length === 0 ? (
            <div className="px-4 py-2.5 text-sm text-gray-500">Searching...</div>
          ) : predictions.map((prediction, index) => (
            <button
              key={prediction.placeId}
              type="button"
              role="option"
              aria-selected={index === highlightedIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(prediction)}
              className={cn(
                'w-full px-4 py-2.5 text-left transition-colors flex flex-col',
                index === highlightedIndex ? 'bg-gray-100' : 'hover:bg-gray-50',
              )}
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