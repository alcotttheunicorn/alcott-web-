'use client'

import { useProfile } from '@/hooks/use-profile'

interface HeaderProps {
    setMobileMenuOpen: (open: boolean) => void;
}

export function Header({ setMobileMenuOpen }: HeaderProps) {
    const { displayName } = useProfile()

    return (
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

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-4 ml-auto">
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
                    <span className="hidden md:block text-sm font-semibold text-gray-900">{displayName ?? 'Guest'}</span>
                    <svg className="hidden md:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </header>
    )
}
