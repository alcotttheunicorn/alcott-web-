'use client'

import type { ShipmentSteps } from '@/lib/types/shipment-types'

interface StepperProps {
  steps: ShipmentSteps
  activeIndex: number
}

export function Stepper({ steps, activeIndex }: StepperProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-0.5">{/* Tweak gap between each step item */}
      {/* numbers for shipment page */}
      {steps.map((step, index) => {
        const isActive = index === activeIndex
        const isCompleted = index < activeIndex
        return (
          <div key={step.key} className="flex items-center gap-1 lg:gap-1.5">{/* Control spacing between circle + connector */}
            <div className={`flex flex-col items-center text-center transition-all ${isActive ? 'text-[#4043FF]' : 'text-gray-400'}`}>
              <div
                className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-[11px] lg:text-xs font-bold border-2 ${
                  isActive
                    ? 'border-[#4043FF] text-white bg-[#4043FF]'
                    : isCompleted
                      ? 'border-[#4043FF] text-[#4043FF]'
                      : 'border-gray-300'
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-1 text-[10px] lg:text-[11px] font-semibold uppercase tracking-wide">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-4 lg:w-6 h-0.5 ${index < activeIndex ? 'bg-[#4043FF]' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

