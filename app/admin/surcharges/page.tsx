'use client'

import Link from 'next/link'
import { SurchargeManager } from '@/components/admin/SurchargeManager'
import { ZoneSurchargeManager } from '@/components/admin/ZoneSurchargeManager'

export default function SurchargesPage() {
    return (
        <div className="p-4 lg:p-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <Link href="/admin/orders" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">SURCHARGES</h1>
            </div>

            <div className="max-w-3xl space-y-6">
                <SurchargeManager />
                <ZoneSurchargeManager />
            </div>
        </div>
    )
}
