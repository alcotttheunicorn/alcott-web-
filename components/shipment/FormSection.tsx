'use client'

import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function FormSection({ title, subtitle, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {/* Field stack spacing – tweak here if needed */}
      <div className="space-y-3">{children}</div>
    </div>
  )
}

