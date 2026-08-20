'use client'

import { NAV_ITEMS, type UserNavKey } from '@/components/shared/nav-icons'
import { SidebarLink } from './SidebarLink'

interface DesktopSidebarProps {
    activeNav?: UserNavKey
    inboxBadge?: boolean
}

export function DesktopSidebar({ activeNav, inboxBadge }: DesktopSidebarProps) {
    return (
        <div className="hidden lg:flex w-64 bg-[#4043FF] text-white flex-col shrink-0">
            <div className="p-6 border-b border-[#5A5DFF]">
                <img src="/alcott-white-logo-sidebar-home.png" alt="Alcott Logo" className="h-10 w-auto" />
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
                            hasBadge={item.key === 'inbox' ? inboxBadge : undefined}
                        />
                    ))}
                </ul>
            </nav>
        </div>
    )
}
