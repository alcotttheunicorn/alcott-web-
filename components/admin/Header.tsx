'use client'

import { HeaderActions } from '@/components/layout/HeaderActions'

interface HeaderProps {
    setMobileMenuOpen: (open: boolean) => void;
}

export function Header({ setMobileMenuOpen }: HeaderProps) {
    return (
        <header className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-4 lg:px-6 py-4 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2 cursor-pointer"
            >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Right side — shared bell dropdown + profile via HeaderActions */}
            <div className="flex items-center ml-auto">
                <HeaderActions isAdmin />
            </div>
        </header>
    )
}
