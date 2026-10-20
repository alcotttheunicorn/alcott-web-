'use client'

import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

interface BottomNavLinkProps {
    href: string
    label: string
    icon: ComponentType<SVGProps<SVGSVGElement>>
    active?: boolean
    hasBadge?: boolean
}

export function BottomNavLink({ href, label, icon: Icon, active, hasBadge }: BottomNavLinkProps) {
    return (
        <Link href={href} className={`relative flex flex-col items-center p-2 ${active ? 'text-[#4043FF]' : 'text-gray-500'}`}>
            <Icon className="w-5 h-5 mb-1" />
            {hasBadge && <span className="absolute top-1 right-3 w-2.5 h-2.5 bg-[#4043FF] rounded-full" />}
            <span className="text-xs font-bold">
                {label}
            </span>
        </Link>
    )
}
