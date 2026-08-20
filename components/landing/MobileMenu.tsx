'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function MobileMenu() {
    useEffect(() => {
        const mobileMenuButton = document.querySelector('button[class*="md:hidden"]');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuPanel = document.getElementById('mobile-menu-panel');
        const closeMobileMenu = document.getElementById('close-mobile-menu');

        if (mobileMenuButton && mobileMenuOverlay && mobileMenuPanel) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenuOverlay.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenuPanel.classList.remove('translate-x-full');
                }, 10);
            });
        }

        if (closeMobileMenu && mobileMenuOverlay && mobileMenuPanel) {
            closeMobileMenu.addEventListener('click', function() {
                mobileMenuPanel.classList.add('translate-x-full');
                setTimeout(() => {
                    mobileMenuOverlay.classList.add('hidden');
                }, 300);
            });
        }

        if (mobileMenuOverlay && mobileMenuPanel) {
            mobileMenuOverlay.addEventListener('click', function(e) {
                if (e.target === mobileMenuOverlay) {
                    mobileMenuPanel.classList.add('translate-x-full');
                    setTimeout(() => {
                        mobileMenuOverlay.classList.add('hidden');
                    }, 300);
                }
            });
        }
    }, []);

    return (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 hidden transition-opacity duration-300 ease-in-out" id="mobile-menu-overlay">
            <div className="absolute right-0 top-0 h-full w-2/3 bg-white shadow-xl transform translate-x-full transition-transform duration-300 ease-in-out" id="mobile-menu-panel">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <img src="/alcott-small.png" alt="Alcott Logo" className="h-8 w-auto" />
                    </div>
                    <button className="text-gray-700 hover:text-gray-900" id="close-mobile-menu">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <nav className="space-y-4 mb-8">
                        <a href="#" className="block text-lg font-medium text-gray-700 hover:text-[#4043FF] transition-colors" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Home</a>
                        <a href="#" className="block text-lg font-medium text-gray-700 hover:text-[#4043FF] transition-colors" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Ship</a>
                        <a href="#" className="block text-lg font-medium text-gray-700 hover:text-[#4043FF] transition-colors" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Track</a>
                        <a href="#" className="block text-lg font-medium text-gray-700 hover:text-[#4043FF] transition-colors" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Shop & Ship</a>
                    </nav>

                    <div className="space-y-4 mb-8">
                        <Button
                            variant="outline"
                            className="w-full bg-transparent border-2 border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white py-3 text-base font-semibold rounded-full"
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                            onClick={() => window.location.href = '/lets-get-you-in'}
                        >
                            Sign In
                        </Button>
                        <Button
                            className="w-full bg-[#4043FF] hover:bg-[#3333CC] text-white py-3 text-base font-semibold rounded-full"
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                            onClick={() => window.location.href = '/lets-get-you-in'}
                        >
                            Register
                        </Button>
                        <Button
                            className="w-full bg-[#4043FF] hover:bg-[#3333CC] text-white py-3 text-base font-semibold rounded-full"
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                            onClick={() => alert('Request a delivery functionality coming soon!')}
                        >
                            Request a delivery
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-500" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                        Alcott V12 © Copyright 2023. All Rights Reserved.
                    </div>
                </div>
            </div>
        </div>
    )
}
