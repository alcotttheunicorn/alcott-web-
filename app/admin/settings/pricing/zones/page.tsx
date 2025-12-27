'use client'

import { useState } from 'react'
import Link from 'next/link'

const zones = [
    {
        id: 1,
        name: 'Zone 6',
        baseCountry: 'NG',
        destinationCountries: ['NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG'],
        importPrices: [
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
        ],
    },
    {
        id: 2,
        name: 'Zone 2',
        baseCountry: 'NG',
        destinationCountries: ['NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG'],
        importPrices: [
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
        ],
    },
    {
        id: 3,
        name: 'Zone 6',
        baseCountry: 'NG',
        destinationCountries: ['NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG'],
        importPrices: [
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
        ],
    },
    {
        id: 4,
        name: 'Zone 6',
        baseCountry: 'NG',
        destinationCountries: ['NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG'],
        importPrices: [
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
        ],
    },
    {
        id: 5,
        name: 'Zone 6',
        baseCountry: 'NG',
        destinationCountries: ['NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG'],
        importPrices: [
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
        ],
    },
    {
        id: 6,
        name: 'Zone 6',
        baseCountry: 'NG',
        destinationCountries: ['NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG', 'NG'],
        importPrices: [
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
            { weightRange: '0 - 2 (KG)', price: 'NGN 134,349.00' },
        ],
    },
]

export default function PricingZonesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [zoneName, setZoneName] = useState('')
    const [sourceCountry, setSourceCountry] = useState('Nigeria')
    const [destinations, setDestinations] = useState('')
    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
    const [priceEntries, setPriceEntries] = useState([
        { id: 1, fromWeight: '0', toWeight: '0', price: '0' }
    ])

    const handleAddPriceEntry = () => {
        setPriceEntries([...priceEntries, {
            id: Date.now(),
            fromWeight: '0',
            toWeight: '0',
            price: '0'
        }])
    }

    const handleRemovePriceEntry = (id: number) => {
        setPriceEntries(priceEntries.filter(entry => entry.id !== id))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Zone submitted:', { zoneName, sourceCountry, destinations, activeTab, priceEntries })
        setIsModalOpen(false)
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
                <div className="flex items-center gap-2">
                    <Link href="/admin/users" className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-sm lg:text-base font-bold text-gray-900 tracking-wide">PRICING ZONES</h1>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-[#4043FF] hover:text-[#3333CC] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">ADD ZONE</span>
                </button>
            </div>

            {/* Zones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {zones.map((zone) => (
                    <div
                        key={zone.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                        {/* Zone Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">{zone.name}</h3>
                            <button className="px-3 py-1 text-xs font-medium text-[#4043FF] border border-[#4043FF] rounded hover:bg-[#4043FF] hover:text-white transition-colors">
                                EDIT
                            </button>
                        </div>

                        {/* Base Country */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Base Country</p>
                            <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded border border-gray-200">
                                {zone.baseCountry}
                            </span>
                        </div>

                        {/* Destination Countries */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Destination Countries</p>
                            <div className="flex flex-wrap gap-1.5">
                                {zone.destinationCountries.map((country, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded border border-gray-200"
                                    >
                                        {country}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Import Prices */}
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Import Prices</p>
                            <div className="grid grid-cols-2 gap-2">
                                {zone.importPrices.map((priceItem, index) => (
                                    <div
                                        key={index}
                                        className="p-2 bg-gray-50 rounded border border-gray-200"
                                    >
                                        <p className="text-xs text-gray-600 mb-0.5">{priceItem.weightRange}</p>
                                        <p className="text-xs font-medium text-gray-900">{priceItem.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing Zone Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-[#4043FF] px-4 py-3 flex items-center justify-between sticky top-0">
                            <h2 className="text-white font-semibold text-sm lg:text-base">Pricing Zone Form</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-4 lg:p-6">
                            {/* Name Field */}
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={zoneName}
                                    onChange={(e) => setZoneName(e.target.value)}
                                    placeholder="Name"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Source Country Dropdown */}
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1">Source Country</label>
                                <select
                                    value={sourceCountry}
                                    onChange={(e) => setSourceCountry(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none appearance-none bg-white"
                                >
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="Ghana">Ghana</option>
                                    <option value="Kenya">Kenya</option>
                                    <option value="South Africa">South Africa</option>
                                </select>
                            </div>

                            {/* Destinations Dropdown */}
                            <div className="mb-4">
                                <select
                                    value={destinations}
                                    onChange={(e) => setDestinations(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none appearance-none bg-white"
                                >
                                    <option value="">Destinations</option>
                                    <option value="All">All Countries</option>
                                    <option value="Africa">Africa</option>
                                    <option value="Europe">Europe</option>
                                    <option value="Americas">Americas</option>
                                </select>
                            </div>

                            {/* Prices Section */}
                            <div className="mb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-sm font-medium text-gray-900">Pri...</span>
                                    <button
                                        type="button"
                                        onClick={handleAddPriceEntry}
                                        className="p-1 bg-[#4043FF] rounded-full text-white hover:bg-[#3333CC] transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    <span className="text-xs text-gray-500">CLONE FROM</span>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('import')}
                                        className={`text-xs font-medium ${activeTab === 'import' ? 'text-[#4043FF]' : 'text-gray-500'}`}
                                    >
                                        IMPORT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('export')}
                                        className={`text-xs font-medium ${activeTab === 'export' ? 'text-[#4043FF]' : 'text-gray-500'}`}
                                    >
                                        EXPORT
                                    </button>
                                </div>

                                {/* Price Entries Table */}
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
                                            {priceEntries.map((entry) => (
                                                <tr key={entry.id} className="border-t border-gray-100">
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="text"
                                                            value={entry.fromWeight}
                                                            onChange={(e) => {
                                                                setPriceEntries(priceEntries.map(p =>
                                                                    p.id === entry.id ? { ...p, fromWeight: e.target.value } : p
                                                                ))
                                                            }}
                                                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                                        />
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="text"
                                                            value={entry.toWeight}
                                                            onChange={(e) => {
                                                                setPriceEntries(priceEntries.map(p =>
                                                                    p.id === entry.id ? { ...p, toWeight: e.target.value } : p
                                                                ))
                                                            }}
                                                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                                        />
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="text"
                                                            value={entry.price}
                                                            onChange={(e) => {
                                                                setPriceEntries(priceEntries.map(p =>
                                                                    p.id === entry.id ? { ...p, price: e.target.value } : p
                                                                ))
                                                            }}
                                                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                                        />
                                                    </td>
                                                    <td className="py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemovePriceEntry(entry.id)}
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
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-[#4043FF] text-white font-semibold rounded-full hover:bg-[#3333CC] transition-colors text-sm"
                            >
                                SUBMIT
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
