'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

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

function SidebarIcon({ type }: { type: string }) {
    switch (type) {
        case 'orders':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        case 'rates':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            )
        case 'users':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        case 'settings':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        case 'policies':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        case 'pricing':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            )
        case 'events':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        case 'monitor':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        case 'premise':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        case 'zones':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        case 'regions':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        default:
            return null
    }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [pricingOpen, setPricingOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isActive = (href: string) => pathname.startsWith(href)

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex w-full overflow-x-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-56 bg-[#4043FF] text-white flex-col fixed h-full z-40">
                {/* Logo */}
                <div className="p-5 border-b border-[#5A5DFF]">
                    <img src="/alcott-white-logo-sidebar-home.png" alt="Alcott Logo" className="h-8 w-auto" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4">
                    <ul className="space-y-1">
                        {sidebarLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
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
                                className={`w-full flex items-center justify-between gap-3 px-5 py-3 text-sm font-semibold transition-colors text-white/80 hover:bg-white/10 hover:text-white`}
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
                                            className={`w-full flex items-center justify-between gap-3 px-5 py-2 text-sm font-medium transition-colors text-white/70 hover:bg-white/10 hover:text-white`}
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
                </nav>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    {/* Sidebar */}
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#4043FF] text-white flex flex-col">
                        {/* Logo and Close */}
                        <div className="p-5 border-b border-[#5A5DFF] flex items-center justify-between">
                            <img src="/alcott-white-logo-sidebar-home.png" alt="Alcott Logo" className="h-8 w-auto" />
                            <button onClick={() => setMobileMenuOpen(false)} className="text-white/80 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 py-4 overflow-y-auto">
                            <ul className="space-y-1">
                                {sidebarLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
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
                                        className={`w-full flex items-center justify-between gap-3 px-5 py-3 text-sm font-semibold transition-colors text-white/80 hover:bg-white/10 hover:text-white`}
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

                                    {settingsOpen && (
                                        <ul className="ml-6 mt-1 space-y-1">
                                            {settingsLinks.map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setMobileMenuOpen(false)}
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

                                {/* Monitor */}
                                <li>
                                    <Link
                                        href="/admin/monitor"
                                        onClick={() => setMobileMenuOpen(false)}
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
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-56 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-4 lg:px-6 py-4 flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Enter Order ID"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent text-gray-900 placeholder:text-gray-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 lg:gap-4 ml-2">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                                <img src="/avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                            </div>
                            <span className="hidden md:block text-sm font-semibold text-gray-900">Olusegun Matanmi</span>
                            <svg className="hidden md:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto pb-20 lg:pb-0">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
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
                            className="flex flex-col items-center px-3 py-2 text-gray-500"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span className="text-xs mt-1 font-medium">More</span>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    )
}
