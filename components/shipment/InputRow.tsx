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
  error?: string
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
  error,
}: InputRowProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value
    const nextValue = transform ? transform(rawValue) : rawValue
    onChange(nextValue)
  }

  return (
    <div className={`space-y-1.5 ${containerClassName ?? ''}`}>
      <label className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>{label}</label>
      <div className="flex items-center rounded-xl bg-[#F9F9F9] border border-gray-200 focus-within:ring-2 focus-within:ring-[#4043FF]/20 transition-all focus-within:border-[#4043FF]/30 focus-within:bg-white">
        {prefix && (
          <div className="pl-4 pr-1 flex items-center justify-center text-gray-500">
            {prefix}
          </div>
        )}
        <Input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={`h-12 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 flex-1 px-4 min-w-0 shadow-none text-[15px] font-medium placeholder:text-gray-400 placeholder:font-normal ${prefix ? 'pl-2' : ''} ${inputClassName ?? ''}`}
          style={{ fontFamily: "'Urbanist', sans-serif" }}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
        />
        {suffix && <div className={`pr-4 flex items-center text-gray-500 ${suffixClassName ?? ''}`}>{suffix}</div>}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

