'use client'

import { useState } from 'react'

interface DeliveryInfoCardProps {
    estimatedDate: string
    editable?: boolean
    disabled?: boolean
    onSave?: (values: { estimatedDate: string }) => void
}

function displayDate(value: string) {
    if (!value) return 'Not set'
    const date = new Date(`${value.slice(0, 10)}T00:00:00`)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function DeliveryInfoCard({ estimatedDate, editable, disabled, onSave }: DeliveryInfoCardProps) {
    const [editing, setEditing] = useState(false)
    const [date, setDate] = useState(estimatedDate.slice(0, 10))
    const [dateError, setDateError] = useState('')

    const startEdit = () => {
        setDate(estimatedDate.slice(0, 10))
        setDateError('')
        setEditing(true)
    }

    const cancelEdit = () => {
        setEditing(false)
        setDate(estimatedDate.slice(0, 10))
        setDateError('')
    }

    const submit = () => {
        if (!date) {
            setDateError('Choose an estimated delivery date.')
            return
        }
        onSave?.({ estimatedDate: new Date(`${date}T00:00:00.000Z`).toISOString() })
        setEditing(false)
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Delivery</h3>
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
                        <span className="text-sm text-gray-500">Estimated delivery</span>
                        <span className="text-sm font-semibold text-gray-900">{displayDate(estimatedDate)}</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Estimated delivery date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setDateError('') }}
                            disabled={disabled}
                            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent disabled:opacity-50"
                        />
                    </div>
                    {dateError && <p className="text-xs text-red-600" role="alert">{dateError}</p>}
                </div>
            )}
        </div>
    )
}