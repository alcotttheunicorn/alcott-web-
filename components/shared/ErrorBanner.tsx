'use client'

interface ErrorBannerProps {
    message: string
    variant?: 'default' | 'red'
}

export function ErrorBanner({ message, variant = 'default' }: ErrorBannerProps) {
    if (variant === 'red') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-sm text-red-600">{message}</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            {message}
        </div>
    )
}
