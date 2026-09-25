'use client'

import { useState } from 'react'

interface DeliveryInfoCardProps {
    estDays: number
    estDate: string
    editable?: boolean
    disabled?: boolean
    onSave?: (values: { minDays: number; maxDays: number }) => void
}

export function DeliveryInfoCard({ estDays, estDate, editable, disabled, onSave }: DeliveryInfoCardProps) {
    const [editing, setEditing] = useState(false)
    const [minDays, setMinDays] = useState(estDays > 0 ? estDays : '')
    const [maxDays, setMaxDays] = useState(estDays > 0 ? estDays : '')

    const startEdit = () => {
        setMinDays(estDays > 0 ? estDays : '')
        setMaxDays(estDays > 0 ? estDays : '')
        setEditing(true)
    }

    const cancelEdit = () => {
        setEditing(false)
        setMinDays(estDays > 0 ? estDays : '')
        setMaxDays(estDays > 0 ? estDays : '')
    }

    const submit = () => {
        const min = Number(minDays)
        const max = Number(maxDays)
        if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0) return
        onSave?.({ minDays: min, maxDays: max })
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
                        <span className="text-sm text-gray-500">Est. Days</span>
                        <span className="text-sm font-semibold text-gray-900">{estDays || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Est. Date</span>
                        <span className="text-sm font-semibold text-gray-900">{estDate}</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Min Days</label>
                        <input
                            type="number"
                            min={0}
                            value={minDays}
                            onChange={(e) => setMinDays(e.target.value)}
                            disabled={disabled}
                            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Max Days</label>
                        <input
                            type="number"
                            min={0}
                            value={maxDays}
                            onChange={(e) => setMaxDays(e.target.value)}
                            disabled={disabled}
                            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent disabled:opacity-50"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}