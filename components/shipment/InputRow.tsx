'use client'

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { Input } from '@/components/ui/input'

interface InputRowProps {
  label: string
  placeholder: string
  value: string
  onChange: (text: string) => void
  type?: string
  prefix?: ReactNode
  suffix?: ReactNode
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete']
  maxLength?: number
  pattern?: string
  transform?: (value: string) => string
  containerClassName?: string
  inputClassName?: string
  suffixClassName?: string
}

export function InputRow({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  inputMode,
  autoComplete,
  maxLength,
  pattern,
  transform,
  containerClassName,
  inputClassName,
  suffixClassName,
}: InputRowProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value
    const nextValue = transform ? transform(rawValue) : rawValue
    onChange(nextValue)
  }

  return (
    <div className={`space-y-1.5 ${containerClassName ?? ''}`}>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 focus-within:bg-white transition-colors">
        {prefix && (
          <div className="pl-3 pr-3 flex items-center gap-2 text-sm text-gray-500 border-r border-gray-200">{/* Divider between prefix & input */}
            {prefix}
          </div>
        )}
        <Input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={`h-12 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 flex-1 px-4 min-w-0 ${inputClassName ?? ''}`}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
        />
        {suffix && <div className={`pr-3 text-sm text-gray-500 ${suffixClassName ?? ''}`}>{suffix}</div>}
      </div>
    </div>
  )
}

