'use client'

import { useState } from 'react'

export type CompleteMethod = 'USER_WALLET' | 'CARD' | 'ADMIN_WALLET'

interface ActionsCardProps {
  status: string | undefined
  disabled?: boolean
  onStartProcessing?: () => void
  onDeliver?: () => void
  onCancel?: () => void
  onComplete?: (method: CompleteMethod) => void
}

const COMPLETE_METHODS: { value: CompleteMethod; label: string }[] = [
  { value: 'USER_WALLET', label: 'Charge Customer Wallet' },
  { value: 'ADMIN_WALLET', label: 'Mark Paid (Admin)' },
  { value: 'CARD', label: 'Paystack Checkout' },
]

export function ActionsCard({ status, disabled, onStartProcessing, onDeliver, onCancel, onComplete }: ActionsCardProps) {
  const [completeOpen, setCompleteOpen] = useState(false)

  const canComplete = status === 'UNPAID' && !!onComplete
  const canStart = status === 'SUBMITTED' && !!onStartProcessing
  const canDeliver = status === 'ON_PROCESS' && !!onDeliver
  const canCancel = (status === 'UNPAID' || status === 'SUBMITTED' || status === 'ON_PROCESS') && !!onCancel

  const hasActions = canComplete || canStart || canDeliver || canCancel

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Actions</h3>
      {!hasActions ? (
        <p className="text-sm text-gray-400 text-center py-4">No actions available for this order.</p>
      ) : (
        <div className="space-y-3">
          {canStart && (
            <button
              disabled={disabled}
              onClick={onStartProcessing}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-700">Start Processing</span>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}

          {canDeliver && (
            <button
              disabled={disabled}
              onClick={onDeliver}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-700">Mark as Delivered</span>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}

          {canComplete && (
            <div className="border border-gray-200 rounded-lg">
              <button
                disabled={disabled}
                onClick={() => setCompleteOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-700">Complete Order</span>
                <svg className={`w-5 h-5 text-[#4043FF] transition-transform ${completeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {completeOpen && (
                <div className="border-t border-gray-200 p-2 space-y-1">
                  {COMPLETE_METHODS.map((method) => (
                    <button
                      key={method.value}
                      disabled={disabled}
                      onClick={() => {
                        setCompleteOpen(false)
                        onComplete?.(method.value)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {canCancel && (
            <button
              disabled={disabled}
              onClick={onCancel}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-700">Cancel Order</span>
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}