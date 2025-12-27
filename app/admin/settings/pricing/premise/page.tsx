'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PricingPremisePage() {
    const [baseRangeCost, setBaseRangeCost] = useState('1000')
    const [costPerKM, setCostPerKM] = useState('1000')
    const [costPerMinute, setCostPerMinute] = useState('1000')
    const [costPerKG, setCostPerKG] = useState('1000')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Pricing submitted:', { baseRangeCost, costPerKM, costPerMinute, costPerKG })
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            {/* Page Header */}
            <div className="flex items-center gap-2 mb-8 lg:mb-10">
                <Link href="/admin/users" className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-sm lg:text-base font-bold text-gray-900 tracking-wide">PRICING PREMISE</h1>
            </div>

            {/* Pricing Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl pl-4 lg:pl-8 pr-4 lg:pr-8 space-y-6 lg:space-y-8">
                {/* Base Range Cost */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                    <label className="text-sm text-gray-700 font-medium w-32 flex-shrink-0">Base Range Cost</label>
                    <div className="flex items-center gap-3 flex-1">
                        <input
                            type="text"
                            value={baseRangeCost}
                            onChange={(e) => setBaseRangeCost(e.target.value)}
                            className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                        />
                        <span className="text-sm text-gray-600 font-medium">NGN</span>
                    </div>
                </div>

                {/* Cost Per KM */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                    <label className="text-sm text-gray-700 font-medium w-32 flex-shrink-0">Cost Per KM</label>
                    <div className="flex items-center gap-3 flex-1">
                        <input
                            type="text"
                            value={costPerKM}
                            onChange={(e) => setCostPerKM(e.target.value)}
                            className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                        />
                        <span className="text-sm text-gray-600 font-medium">NGN</span>
                    </div>
                </div>

                {/* Cost Per Minute */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                    <label className="text-sm text-gray-700 font-medium w-32 flex-shrink-0">Cost Per Minute</label>
                    <div className="flex items-center gap-3 flex-1">
                        <input
                            type="text"
                            value={costPerMinute}
                            onChange={(e) => setCostPerMinute(e.target.value)}
                            className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                        />
                        <span className="text-sm text-gray-600 font-medium">NGN</span>
                    </div>
                </div>

                {/* Cost Per KG */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                    <label className="text-sm text-gray-700 font-medium w-32 flex-shrink-0">Cost Per KG</label>
                    <div className="flex items-center gap-3 flex-1">
                        <input
                            type="text"
                            value={costPerKG}
                            onChange={(e) => setCostPerKG(e.target.value)}
                            className="flex-1 px-0 py-2 border-0 border-b border-gray-300 text-sm text-gray-900 focus:ring-0 focus:border-[#4043FF] outline-none bg-transparent"
                        />
                        <span className="text-sm text-gray-600 font-medium">NGN</span>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 lg:pt-6">
                    <button
                        type="submit"
                        className="w-full sm:w-auto sm:min-w-[300px] py-3 px-8 bg-[#4043FF] text-white font-semibold rounded-full hover:bg-[#3333CC] transition-colors text-sm"
                    >
                        SUBMIT
                    </button>
                </div>
            </form>
        </div>
    )
}
