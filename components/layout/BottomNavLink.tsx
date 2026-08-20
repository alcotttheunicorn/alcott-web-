'use client'

import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

interface BottomNavLinkProps {
    href: string
    label: string
    icon: ComponentType<SVGProps<SVGSVGElement>>
    active?: boolean
}

export function BottomNavLink({ href, label, icon: Icon, active }: BottomNavLinkProps) {
    return (
        <Link href={href} className={`flex flex-col items-center p-2 ${active ? 'text-[#4043FF]' : 'text-gray-500'}`}>
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                {label}
            </span>
        </Link>
    )
}
