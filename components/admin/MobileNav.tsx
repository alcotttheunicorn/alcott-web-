'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarIcon } from './SidebarIcon'

interface MobileNavProps {
    setMobileMenuOpen: (open: boolean) => void;
}

export function MobileNav({ setMobileMenuOpen }: MobileNavProps) {
    const pathname = usePathname()
    const isActive = (href: string) => pathname.startsWith(href)

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
            <div className="flex justify-around py-2">
                <Link
                    href="/admin/orders"
                    className={`flex flex-col items-center px-3 py-2 ${isActive('/admin/orders') ? 'text-[#4043FF]' : 'text-gray-500'}`}
                >
                    <SidebarIcon type="orders" />
                    <span className="text-xs mt-1 font-medium">Orders</span>
                </Link>
                <Link
                    href="/admin/rates"
                    className={`flex flex-col items-center px-3 py-2 ${isActive('/admin/rates') ? 'text-[#4043FF]' : 'text-gray-500'}`}
                >
                    <SidebarIcon type="rates" />
                    <span className="text-xs mt-1 font-medium">Rates</span>
                </Link>
                <Link
                    href="/admin/users"
                    className={`flex flex-col items-center px-3 py-2 ${isActive('/admin/users') ? 'text-[#4043FF]' : 'text-gray-500'}`}
                >
                    <SidebarIcon type="users" />
                    <span className="text-xs mt-1 font-medium">Users</span>
                </Link>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="flex flex-col items-center px-3 py-2 text-gray-500 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="text-xs mt-1 font-medium">More</span>
                </button>
            </div>
        </nav>
    )
}
