'use client'

import { StatusBadge } from './StatusBadge'

interface OrderInfoBarProps {
    charge: number
    currency: string
    orderId: string | null
    status: string
    submittedAt: string
    processingStart: string
    processingEnd: string
}

function formatCurrency(amount: number, currency: string) {
    return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function OrderInfoBar({ charge, currency, orderId, status, submittedAt, processingStart, processingEnd }: OrderInfoBarProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-3 gap-6">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Charge</p>
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {formatCurrency(charge, currency)}
                    </span>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Order id</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        {orderId || 'N/A'}
                        {orderId && (
                            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <StatusBadge status={status} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4 pt-4 border-t border-gray-100">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="text-sm font-semibold text-gray-900">{submittedAt}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Processing Start</p>
                    <p className="text-sm font-semibold text-gray-900">{processingStart}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Processing End</p>
                    <p className="text-sm font-semibold text-gray-900">{processingEnd}</p>
                </div>
            </div>
        </div>
    )
}
