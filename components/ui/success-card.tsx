import React from 'react'
import { cn } from '@/lib/utils'
import { DotsSpinner } from './loading-spinner'

interface SuccessCardProps {
  title: string
  description: string
  showSpinner?: boolean
  className?: string
  iconClassName?: string
}

export function SuccessCard({ 
  title, 
  description, 
  showSpinner = false, 
  className,
  iconClassName 
}: SuccessCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl p-12 shadow-lg max-w-lg mx-auto text-center relative',
      className
    )}>
      {/* Decorative dots */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-red-400 rounded-full"></div>
      <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
      <div className="absolute top-12 right-4 w-1 h-1 bg-red-300 rounded-full"></div>
      <div className="absolute bottom-20 left-6 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
      <div className="absolute bottom-12 right-12 w-1 h-1 bg-purple-400 rounded-full"></div>
      <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-green-400 rounded-full"></div>

      {/* Main icon */}
      <div className={cn(
        'w-24 h-24 bg-[#4043FF] rounded-full flex items-center justify-center mx-auto mb-8',
        iconClassName
      )}>
        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.9 6.1 16 10 16V18H8V20H16V18H14V16C17.9 16 21 12.9 21 9Z"/>
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {title}
      </h2>

      {/* Description */}
      <div className="space-y-2 mb-8">
        <p className="text-lg text-gray-600 font-medium">
          {description}
        </p>
      </div>

      {/* Loading spinner */}
      {showSpinner && (
        <DotsSpinner className="justify-center" color="primary" />
      )}
    </div>
  )
}
