'use client'

interface Slab {
    id: number
    from_weight: string
    to_weight: string
    price: string
}

interface SlabEditorTableProps {
    slabs: Slab[]
    onChange: (slabs: Slab[]) => void
}

export function SlabEditorTable({ slabs, onChange }: SlabEditorTableProps) {
    const handleChange = (id: number, field: keyof Slab, value: string) => {
        onChange(slabs.map(s => s.id === id ? { ...s, [field]: value } : s))
    }

    const handleRemove = (id: number) => {
        onChange(slabs.filter(s => s.id !== id))
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-xs text-gray-500">
                        <th className="text-left pb-2 font-medium">From Weight(KG)</th>
                        <th className="text-left pb-2 font-medium">To Weight(KG)</th>
                        <th className="text-left pb-2 font-medium">Price (NGN)</th>
                        <th className="pb-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {slabs.map((entry) => (
                        <tr key={entry.id} className="border-t border-gray-100">
                            <td className="py-2 pr-2">
                                <input
                                    type="text"
                                    value={entry.from_weight}
                                    onChange={(e) => handleChange(entry.id, 'from_weight', e.target.value)}
                                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                />
                            </td>
                            <td className="py-2 pr-2">
                                <input
                                    type="text"
                                    value={entry.to_weight}
                                    onChange={(e) => handleChange(entry.id, 'to_weight', e.target.value)}
                                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                />
                            </td>
                            <td className="py-2 pr-2">
                                <input
                                    type="text"
                                    value={entry.price}
                                    onChange={(e) => handleChange(entry.id, 'price', e.target.value)}
                                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                />
                            </td>
                            <td className="py-2">
                                <button
                                    type="button"
                                    onClick={() => handleRemove(entry.id)}
                                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
