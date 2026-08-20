'use client'

import { NAV_ITEMS, type UserNavKey } from '@/components/shared/nav-icons'
import { SidebarLink } from './SidebarLink'

interface MobileSidebarProps {
    onClose: () => void
    activeNav?: UserNavKey
    inboxBadge?: boolean
}

export function MobileSidebar({ onClose, activeNav, inboxBadge }: MobileSidebarProps) {
    return (
        <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-64 bg-[#4043FF] text-white flex-col flex transform transition-transform duration-300">
                <div className="p-6 border-b border-[#5A5DFF] flex items-center justify-between">
                    <img src="/alcott-white-logo-sidebar-home.png" alt="Alcott Logo" className="h-8 w-auto" />
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        {NAV_ITEMS.map((item) => (
                            <SidebarLink
                                key={item.key}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                active={activeNav === item.key}
                                onClick={onClose}
                                hasBadge={item.key === 'inbox' ? inboxBadge : undefined}
                            />
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}
