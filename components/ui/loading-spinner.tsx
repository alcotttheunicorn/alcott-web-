import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <Loader2
        className={cn('animate-spin text-[#4043FF]', sizeClasses[size], className)}
      />
      {label && (
        <p className="text-sm text-gray-500">{label}</p>
      )}
    </div>
  )
}

export function InlineSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn('animate-spin h-4 w-4', className)} />
}

interface DotsSpinnerProps {
  className?: string
  color?: 'primary' | 'white' | 'gray'
}

export function DotsSpinner({ className, color = 'primary' }: DotsSpinnerProps) {
  const dotColor = {
    primary: 'bg-[#4043FF]',
    white: 'bg-white',
    gray: 'bg-gray-400',
  }[color]

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className={cn('h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s]', dotColor)} />
      <span className={cn('h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s]', dotColor)} />
      <span className={cn('h-2 w-2 rounded-full animate-bounce', dotColor)} />
    </div>
  )
}