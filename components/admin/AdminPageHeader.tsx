'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface AdminPageHeaderProps {
    title: string
    backHref: string
    children?: ReactNode
}

export function AdminPageHeader({ title, backHref, children }: AdminPageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-2">
                <Link href={backHref} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-sm lg:text-base font-bold text-gray-900 tracking-wide">{title}</h1>
            </div>
            {children}
        </div>
    )
}
