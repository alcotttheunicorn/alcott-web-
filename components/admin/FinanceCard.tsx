'use client'

import { useState } from 'react'

interface FinanceCardProps {
    amountPaid: number
    paymentMethod: string
    paymentStatus: string
    expenses: number
    profit: number
    currency: string
    editable?: boolean
    disabled?: boolean
    onSave?: (values: { amountPaid: number; paymentMethod: string; paymentStatus: string }) => void
}

function formatCurrency(amount: number, currency: string) {
    return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function FinanceCard({
    amountPaid,
    paymentMethod,
    paymentStatus,
    expenses,
    profit,
    currency,
    editable,
    disabled,
    onSave,
}: FinanceCardProps) {
    const [editing, setEditing] = useState(false)
    const [amount, setAmount] = useState(amountPaid > 0 ? String(amountPaid) : '')
    const [method, setMethod] = useState(paymentMethod)
    const [status, setStatus] = useState(paymentStatus)

    const startEdit = () => {
        setAmount(amountPaid > 0 ? String(amountPaid) : '')
        setMethod(paymentMethod)
        setStatus(paymentStatus)
        setEditing(true)
    }

    const cancelEdit = () => setEditing(false)

    const submit = () => {
        const parsed = Number(amount)
        if (!Number.isFinite(parsed) || parsed < 0) return
        onSave?.({ amountPaid: parsed, paymentMethod: method.trim(), paymentStatus: status.trim() })
        setEditing(false)
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Finance</h3>
                {editable && !editing && (
                    <button onClick={startEdit} disabled={disabled} className="text-[#4043FF] text-xs font-semibold flex items-center gap-1 disabled:opacity-50 cursor-pointer">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        EDIT
                    </button>
                )}
                {editing && (
                    <div className="flex items-center gap-2">
                        <button onClick={cancelEdit} disabled={disabled} className="text-xs font-semibold text-gray-500 disabled:opacity-50 cursor-pointer">CANCEL</button>
                        <button onClick={submit} disabled={disabled} className="text-xs font-semibold text-[#4043FF] disabled:opacity-50 cursor-pointer">DONE</button>
                    </div>
                )}
            </div>
            {!editing ? (
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount paid (Revenue)</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {amountPaid > 0 ? formatCurrency(amountPaid, currency) : 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment method</span>
                        <span className="text-sm font-semibold text-gray-900">{paymentMethod || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment Status</span>
                        <span className={`text-sm font-semibold ${paymentStatus === 'PAID' ? 'text-green-600' : paymentStatus === 'CANCELLED' ? 'text-red-600' : 'text-gray-900'}`}>
                            {paymentStatus}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Expenses</span>
                        <span className="text-sm font-semibold text-red-500">
                            {expenses !== 0 ? formatCurrency(expenses, currency) : 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Profit</span>
                        <span className="text-sm font-semibold text-green-600">
                            {profit > 0 ? formatCurrency(profit, currency) : 'N/A'}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Amount paid (Revenue)</label>
                        <input
                            type="number"
                            min={0}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={disabled}
                            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Payment method</label>
                        <input
                            type="text"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            disabled={disabled}
                            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Payment Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={disabled}
                            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent disabled:opacity-50"
                        >
                            <option value="UNPAID">UNPAID</option>
                            <option value="PAID">PAID</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    )
}