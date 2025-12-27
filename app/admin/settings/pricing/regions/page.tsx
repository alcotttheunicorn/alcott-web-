'use client'

import { useState } from 'react'
import Link from 'next/link'

const regions = [
    {
        id: 'south',
        name: 'South',
        states: ['Rivers', 'Akwa Ibom', 'Bayelsa', 'Cross River', 'Edo', 'Delta'],
    },
    {
        id: 'north',
        name: 'North',
        states: ['Niger', 'Adamawa', 'Plateau', 'Nasarawa', 'Kogi', 'Borno', 'Federal Capital Territory', 'Kaduna', 'Yobe', 'Kebbi', 'Taraba', 'Jigawa', 'Bauchi', 'Katsina', 'Gombe', 'Zamfara', 'Sokoto', 'Kano', 'Benue'],
    },
    {
        id: 'east',
        name: 'East',
        states: ['Imo', 'Anambra', 'Ebonyi', 'Enugu', 'Abia'],
    },
    {
        id: 'west',
        name: 'West',
        states: ['Oyo', 'Ogun State', 'Lagos', 'Ekiti', 'Ondo', 'Kwara', 'Osun'],
    },
]

const zoneRegions = [
    {
        id: 'zone3a',
        name: 'Zone 3',
        pairs: ['West -> East', 'West -> South', 'South -> West', 'East -> West', 'West -> North', 'North -> West'],
    },
    {
        id: 'zone1',
        name: 'Zone 1',
        pairs: ['West -> West', 'South -> South', 'North -> North', 'East -> East'],
    },
    {
        id: 'zone2',
        name: 'Zone 2',
        pairs: [],
    },
    {
        id: 'zone3b',
        name: 'Zone 3',
        pairs: ['East -> North', 'South -> North', 'North -> South', 'North -> East'],
    },
]

const zonedPrices = [
    { id: 1, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 2, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 3, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 4, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 5, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 6, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 7, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 8, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 9, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 10, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 11, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 12, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 13, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
    { id: 14, zone: 'Zone 1', fromWeight: '5.5*', toWeight: '6', price: '40635' },
]

export default function PricingRegionsPage() {
    const [isRegionModalOpen, setIsRegionModalOpen] = useState(false)
    const [regionName, setRegionName] = useState('North')
    const [regionStates, setRegionStates] = useState([
        'Plateau', 'Adamawa', 'Nasarawa', 'Kaduna',
        'Zamfara', 'Bauchi', 'Katsina', 'Kogi',
        'Kebbi', 'Jigawa', 'Taraba', 'Gombe',
        'Sokoto', 'Kebbi', 'Borno', 'Benue',
        'Federal Capital Territory', 'Niger', 'Kano'
    ])
    const [newState, setNewState] = useState('')

    const handleRemoveState = (stateToRemove: string) => {
        setRegionStates(regionStates.filter(state => state !== stateToRemove))
    }

    const handleAddState = () => {
        if (newState.trim() && !regionStates.includes(newState.trim())) {
            setRegionStates([...regionStates, newState.trim()])
            setNewState('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddState()
        }
    }

    const handleSubmitRegion = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Region submitted:', { name: regionName, states: regionStates })
        setIsRegionModalOpen(false)
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            {/* Page Header */}
            <div className="flex items-center gap-2 mb-6 lg:mb-8">
                <Link href="/admin/users" className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-sm lg:text-base font-bold text-gray-900 tracking-wide">PRICING REGIONS</h1>
            </div>

            {/* Regions Container */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6">
                {/* Regions Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-gray-900">REGIONS</h2>
                    <button
                        onClick={() => setIsRegionModalOpen(true)}
                        className="text-[#4043FF] text-sm font-medium hover:text-[#3333CC] transition-colors"
                    >
                        ADD
                    </button>
                </div>

                {/* Regions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {regions.map((region) => (
                        <div
                            key={region.id}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            {/* Region Header */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-900">{region.name}</h3>
                                <button className="px-3 py-1 text-xs font-medium text-[#4043FF] border border-[#4043FF] rounded hover:bg-[#4043FF] hover:text-white transition-colors">
                                    EDIT
                                </button>
                            </div>

                            {/* Region States Label */}
                            <p className="text-xs text-gray-500 mb-2">Region States</p>

                            {/* States Tags */}
                            <div className="flex flex-wrap gap-2">
                                {region.states.map((state, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded-full border border-gray-200"
                                    >
                                        {state}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone Regions Container */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                {/* Zone Regions Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-gray-900">Zone Regions</h2>
                    <button className="text-[#4043FF] text-sm font-medium hover:text-[#3333CC] transition-colors">
                        ADD
                    </button>
                </div>

                {/* Zone Regions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {zoneRegions.map((zone, idx) => (
                        <div
                            key={zone.id + idx}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            {/* Zone Header */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-900">{zone.name}</h3>
                                <button className="px-3 py-1 text-xs font-medium text-[#4043FF] border border-[#4043FF] rounded hover:bg-[#4043FF] hover:text-white transition-colors">
                                    EDIT
                                </button>
                            </div>

                            {/* Region Pairs Label */}
                            <p className="text-xs text-gray-500 mb-2">Region Pairs</p>

                            {/* Pairs Tags */}
                            <div className="flex flex-wrap gap-2">
                                {zone.pairs.length > 0 ? (
                                    zone.pairs.map((pair, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded-full border border-gray-200"
                                        >
                                            {pair}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400">No pairs defined</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zoned Prices Container */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mt-6">
                {/* Zoned Prices Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-gray-900">Zoned Prices</h2>
                    <button className="text-[#4043FF] text-sm font-medium hover:text-[#3333CC] transition-colors">
                        ADD
                    </button>
                </div>

                {/* Zoned Prices Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                                <th className="pb-3 font-medium"></th>
                                <th className="pb-3 font-medium">From Weight(KG)</th>
                                <th className="pb-3 font-medium">To Weight(KG)</th>
                                <th className="pb-3 font-medium">Price (NGN)</th>
                                <th className="pb-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {zonedPrices.map((price) => (
                                <tr key={price.id} className="border-b border-gray-100 last:border-0">
                                    <td className="py-3 text-sm text-gray-900">{price.zone}</td>
                                    <td className="py-3 text-sm text-gray-600">{price.fromWeight}</td>
                                    <td className="py-3 text-sm text-gray-600">{price.toWeight}</td>
                                    <td className="py-3 text-sm text-gray-900">{price.price}</td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2 justify-end">
                                            {/* Edit Button */}
                                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            {/* Delete Button */}
                                            <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pricing Zone Form Modal */}
            {isRegionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setIsRegionModalOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-[#4043FF] px-4 py-3 flex items-center justify-between">
                            <h2 className="text-white font-semibold text-sm lg:text-base">Pricing Zone Form</h2>
                            <button
                                onClick={() => setIsRegionModalOpen(false)}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmitRegion} className="p-4 lg:p-6">
                            {/* Name Field */}
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={regionName}
                                    onChange={(e) => setRegionName(e.target.value)}
                                    placeholder="Enter region name"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                                />
                            </div>

                            {/* State Tags */}
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {regionStates.map((state, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded-full border border-gray-200"
                                        >
                                            {state}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveState(state)}
                                                className="ml-1 text-gray-500 hover:text-gray-700"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* Add State Input */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200 text-xs text-gray-500">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={newState}
                                            onChange={(e) => setNewState(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Add state here"
                                            className="bg-transparent border-0 outline-none text-xs text-gray-700 placeholder:text-gray-400 w-20"
                                        />
                                    </div>
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
