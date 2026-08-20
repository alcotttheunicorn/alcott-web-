'use client'

interface EmptyStateProps {
    message: string
    className?: string
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-8 lg:p-12 text-center text-gray-500 ${className}`}>
            {message}
        </div>
    )
}
