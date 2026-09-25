'use client'

import { Textarea } from '@/components/ui/textarea'

interface TextareaRowProps {
  label: string
  placeholder: string
  value: string
  onChange: (text: string) => void
}

export function TextareaRow({ label, placeholder, value, onChange }: TextareaRowProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>{label}</label>
      <Textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-[#F9F9F9] focus:bg-white focus:ring-2 focus:ring-[#4043FF]/20 focus:border-[#4043FF]/30 shadow-none text-[15px] font-medium placeholder:text-gray-400 placeholder:font-normal px-4 py-3"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      />
    </div>
  )
}

