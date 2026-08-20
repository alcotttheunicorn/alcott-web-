'use client'

import { ArrowLeft } from 'lucide-react'

export function PageHeading({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {onBack && <button onClick={onBack} aria-label="Go back" className="p-2 rounded-full hover:bg-gray-100 transition-colors"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>}
      <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  )
}

export function StatusTabs<T extends string>({ options, value, onChange }: { options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto">
      {options.map((option) => <button key={option.value} onClick={() => onChange(option.value)} className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors whitespace-nowrap ${value === option.value ? 'bg-[#4043FF] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-[#4043FF] hover:text-[#4043FF]'}`}>{option.label}</button>)}
    </div>
  )
}
