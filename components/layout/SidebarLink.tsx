'use client'

import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

interface SidebarLinkProps {
    href: string
    icon: ComponentType<SVGProps<SVGSVGElement>>
    label: string
    active?: boolean
    onClick?: () => void
    hasBadge?: boolean
}

export function SidebarLink({ href, icon: Icon, label, active, onClick, hasBadge }: SidebarLinkProps) {
    return (
        <li>
            <Link
                href={href}
                onClick={onClick}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors font-bold relative ${
                    active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
            >
                <Icon className="w-5 h-5 mr-3" />
                {label}
                {hasBadge && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full" />
                )}
            </Link>
        </li>
    )
}
