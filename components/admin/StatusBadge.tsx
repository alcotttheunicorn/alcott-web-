'use client'

interface StatusBadgeProps {
    status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusStyles = () => {
        switch (status) {
            case 'on_process':
                return 'bg-blue-100 text-blue-600'
            case 'delivered':
                return 'bg-green-100 text-green-600'
            case 'canceled':
                return 'bg-red-100 text-red-600'
            case 'initiated':
                return 'bg-purple-100 text-purple-600'
            case 'pending':
                return 'bg-yellow-100 text-yellow-600'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusStyles()}`}>
            {status.replace('_', ' ')}
        </span>
    )
}
