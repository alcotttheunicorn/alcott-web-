'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CurrencySelector } from '@/components/ui/CurrencySelector'
import { cn } from '@/lib/utils'

export function LandingHeader() {
    const { isAuthenticated, logout } = useAuth()
    const router = useRouter()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 8)
        }
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'w-full bg-[#F3F9FD] sticky top-0 z-40 transition-all duration-300 ease-in-out',
                scrolled &&
                    'backdrop-blur-md supports-[backdrop-filter]:bg-[#F3F9FD]/90 shadow-sm border-b border-gray-100/60'
            )}
        >
            <div className="mx-auto w-full max-w-9xl px-4 lg:px-12 flex items-center justify-between py-3 md:py-4 lg:py-5">
                <div className="flex items-center">
                    <Link href="/" aria-label="Alcott home">
                        <img src="/alcott-small.png" alt="alcott logo" className="h-8 w-auto md:h-12" />
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
                    <a href="/" className="text-gray-700 hover:text-[#4043FF] transition-colors">Home</a>
                    <a href="/shipment/new" className="text-gray-700 hover:text-[#4043FF] transition-colors">Ship</a>
                    <a href="/search" className="text-gray-700 hover:text-[#4043FF] transition-colors">Track</a>
                    <a href="/#" className="text-gray-700 hover:text-[#4043FF] transition-colors">Shop & Ship</a>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <CurrencySelector />
                    {isAuthenticated ? (
                        <>
                            <Button
                                className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-6 py-2 text-base font-semibold rounded-full"

                                onClick={() => router.push('/home')}
                            >
                                Go to Dashboard
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-transparent border-2 border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white px-6 py-2 text-base font-semibold rounded-full"

                                onClick={() => { logout(); router.push('/') }}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                className="bg-transparent border-2 border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white px-6 py-2 text-base font-semibold rounded-full"

                                onClick={() => window.location.href = '/lets-get-you-in'}
                            >
                                Sign In
                            </Button>
                            <Button
                                className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-6 py-2 text-base font-semibold rounded-full"

                                onClick={() => window.location.href = '/register'}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </div>

                <button className="md:hidden" aria-label="Open menu">
                    <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                        <div className="w-full h-0.5 bg-gray-700"></div>
                        <div className="w-full h-0.5 bg-gray-700"></div>
                        <div className="w-full h-0.5 bg-gray-700"></div>
                    </div>
                </button>
            </div>
        </header>
    )
}