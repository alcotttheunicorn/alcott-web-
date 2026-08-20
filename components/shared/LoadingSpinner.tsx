'use client'

interface LoadingSpinnerProps {
    className?: string
}

export function LoadingSpinner({ className = 'py-12' }: LoadingSpinnerProps) {
    return (
        <div className={`flex justify-center ${className}`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
        </div>
    )
}
