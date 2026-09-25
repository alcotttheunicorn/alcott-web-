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
      {/* Field stack spacing – tweak here if needed */}
      <div className="space-y-5 lg:space-y-6">{children}</div>
    </div>
  )
}

