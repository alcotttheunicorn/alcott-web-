'use client'

import { NAV_ITEMS, type UserNavKey } from '@/components/shared/nav-icons'
import { BottomNavLink } from './BottomNavLink'

interface MobileBottomNavProps {
    activeNav?: UserNavKey
}

export function MobileBottomNav({ activeNav }: MobileBottomNavProps) {
    return (
        <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb shrink-0">
            <nav className="flex justify-around items-center">
                {NAV_ITEMS.map((item) => (
                    <BottomNavLink
                        key={item.key}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={activeNav === item.key}
                    />
                ))}
            </nav>
        </div>
    )
}
