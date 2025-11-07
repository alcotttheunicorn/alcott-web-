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
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <Textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-[#4043FF] focus:border-[#4043FF]"
      />
    </div>
  )
}

