'use client'

import { Button } from '@/components/ui/button'

interface ContinueButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function ContinueButton({ label, onClick, disabled }: ContinueButtonProps) {
  return (
    <div className="pt-4">{/* Adjust button offset here */}
      <Button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-12 rounded-full bg-[#4043FF] hover:bg-[#3333CC] text-white font-semibold disabled:opacity-50 disabled:hover:bg-[#4043FF]"
      >
        {label}
      </Button>
    </div>
  )
}

