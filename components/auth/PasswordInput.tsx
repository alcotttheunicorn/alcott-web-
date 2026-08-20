'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'

interface PasswordInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    autoComplete?: string
    required?: boolean
}

export function PasswordInput({ value, onChange, placeholder = 'Password', autoComplete = 'current-password', required }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="border-0 bg-transparent p-0 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-500 flex-1"
                    required={required}
                />
                <button
                    type="button"
                    className={`ml-4 transition-colors duration-300 ${
                        value ? 'text-[#4043FF] hover:text-[#3333CC]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    )
}
