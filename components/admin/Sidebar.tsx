'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SidebarIcon } from './SidebarIcon'

const sidebarLinks = [
    { href: '/admin/orders', label: 'Orders', icon: 'orders' },
    { href: '/admin/rates', label: 'Rates Check', icon: 'rates' },
    { href: '/admin/users', label: 'Users', icon: 'users' },
]

const settingsLinks = [
    { href: '/admin/settings/policies', label: 'Policies', icon: 'policies' },
]

const pricingLinks = [
    { href: '/admin/settings/pricing/premise', label: 'Premise', icon: 'premise' },
    { href: '/admin/settings/pricing/zones', label: 'Zones', icon: 'zones' },
    { href: '/admin/settings/pricing/regions', label: 'Regions', icon: 'regions' },
]

interface SidebarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
    const pathname = usePathname()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [pricingOpen, setPricingOpen] = useState(false)

    const isActive = (href: string) => pathname.startsWith(href)

    const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <ul className="space-y-1">
            {sidebarLinks.map((link) => (
                <li key={link.href}>
                    <Link
                        href={link.href}
                        onClick={() => isMobile && setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors ${isActive(link.href)
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <SidebarIcon type={link.icon} />
                        {link.label}
                    </Link>
                </li>
            ))}

            {/* Settings with submenu */}
            <li>
                <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className={`w-full flex items-center justify-between gap-3 px-5 py-3 text-sm font-semibold transition-colors text-white/80 hover:bg-white/10 hover:text-white cursor-pointer`}
                >
                    <span className="flex items-center gap-3">
                        <SidebarIcon type="settings" />
                        Settings
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Settings submenu */}
                {settingsOpen && (
                    <ul className="ml-6 mt-1 space-y-1">
                        {/* Policies */}
                        {settingsLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => isMobile && setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-5 py-2 text-sm font-medium transition-colors ${isActive(link.href)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <SidebarIcon type={link.icon} />
                                    {link.label}
                                </Link>
                            </li>
                        ))}

                        {/* Pricing Dropdown */}
                        <li>
                            <button
                                onClick={() => setPricingOpen(!pricingOpen)}
                                className={`w-full flex items-center justify-between gap-3 px-5 py-2 text-sm font-medium transition-colors text-white/70 hover:bg-white/10 hover:text-white cursor-pointer`}
                            >
                                <span className="flex items-center gap-3">
                                    <SidebarIcon type="pricing" />
                                    Pricing
                                </span>
                                <svg
                                    className={`w-3 h-3 transition-transform ${pricingOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Pricing submenu */}
                            {pricingOpen && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    {pricingLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                onClick={() => isMobile && setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-5 py-2 text-sm font-medium transition-colors ${isActive(link.href)
                                                    ? 'bg-white/20 text-white'
                                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                <SidebarIcon type={link.icon} />
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        {/* Events */}
                        <li>
                            <Link
                                href="/admin/settings/events"
                                onClick={() => isMobile && setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-5 py-2 text-sm font-medium transition-colors ${isActive('/admin/settings/events')
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <SidebarIcon type="events" />
                                Events
                            </Link>
                        </li>
                    </ul>
                )}
            </li>

            {/* Monitor */}
            <li>
                <Link
                    href="/admin/monitor"
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors ${isActive('/admin/monitor')
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <SidebarIcon type="monitor" />
                    Monitor
                </Link>
            </li>
        </ul>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-56 bg-[#4043FF] text-white flex-col fixed h-full z-40">
                <div className="p-5 border-b border-[#5A5DFF]">
                    <img src="/alcott-white-logo-sidebar-home.png" alt="Alcott Logo" className="h-8 w-auto" />
                </div>
                <nav className="flex-1 py-4">
                    <NavContent />
                </nav>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#4043FF] text-white flex flex-col">
                        <div className="p-5 border-b border-[#5A5DFF] flex items-center justify-between">
                            <img src="/alcott-white-logo-sidebar-home.png" alt="Alcott Logo" className="h-8 w-auto" />
                            <button onClick={() => setMobileMenuOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex-1 py-4 overflow-y-auto">
                            <NavContent isMobile />
                        </nav>
                    </aside>
                </div>
            )}
        </>
    )
}
