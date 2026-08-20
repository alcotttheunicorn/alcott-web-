'use client'

interface FormMessagesProps {
    error?: string | null
    success?: string | null
    centered?: boolean
}

export function FormMessages({ error, success, centered = false }: FormMessagesProps) {
    return (
        <>
            {error && (
                <p className={`text-sm text-red-600 font-bold ${centered ? 'text-center' : ''}`}>
                    {error}
                </p>
            )}
            {success && (
                <p className={`text-sm text-green-600 font-bold ${centered ? 'text-center' : ''}`}>
                    {success}
                </p>
            )}
        </>
    )
}
