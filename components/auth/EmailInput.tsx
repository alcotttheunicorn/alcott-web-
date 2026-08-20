'use client'

import { Input } from '@/components/ui/input'

interface EmailInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    required?: boolean
}

export function EmailInput({ value, onChange, placeholder = 'Email', required }: EmailInputProps) {
    return (
        <div className="relative">
            <div className={`flex items-center rounded-xl px-4 py-4 transition-all duration-300 ease-in-out ${
                value
                    ? 'bg-blue-50 border-2 border-[#4043FF] shadow-lg shadow-blue-100'
                    : 'bg-gray-100 border-2 border-transparent hover:bg-gray-50'
            }`}>
                <svg className={`w-5 h-5 mr-3 shrink-0 transition-colors duration-300 ${
                    value ? 'text-[#4043FF]' : 'text-gray-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <Input
                    type="email"
                    autoComplete="email"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="border-0 bg-transparent p-0 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-500 flex-1"
                    required={required}
                />
            </div>
        </div>
    )
}
