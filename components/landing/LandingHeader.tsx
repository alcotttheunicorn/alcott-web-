'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export function LandingHeader() {
    const { isAuthenticated, logout } = useAuth()
    const router = useRouter()

    return (
        <header className="w-full flex items-center justify-between px-4 md:px-12 py-4 md:py-6 bg-[#F3F9FD]">
            <div className="flex items-center">
                <img src="/alcott-small.png" alt="alcott logo" className="h-8 w-auto md:h-12" />
            </div>

            <nav className="hidden md:flex items-center gap-8 text-lg font-medium" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                <a href="#" className="text-gray-700 hover:text-[#4043FF] transition-colors">Home</a>
                <a href="#" className="text-gray-700 hover:text-[#4043FF] transition-colors">Ship</a>
                <a href="#" className="text-gray-700 hover:text-[#4043FF] transition-colors">Track</a>
                <a href="#" className="text-gray-700 hover:text-[#4043FF] transition-colors">Shop & Ship</a>
            </nav>

            <div className="hidden md:flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <Button
                            className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-6 py-2 text-base font-semibold rounded-full"
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                            onClick={() => router.push('/home')}
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-transparent border-2 border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white px-6 py-2 text-base font-semibold rounded-full"
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
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
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                            onClick={() => window.location.href = '/lets-get-you-in'}
                        >
                            Sign In
                        </Button>
                        <Button
                            className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-6 py-2 text-base font-semibold rounded-full"
                            style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                            onClick={() => window.location.href = '/register'}
                        >
                            Register
                        </Button>
                    </>
                )}
            </div>

            <button className="md:hidden">
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                    <div className="w-full h-0.5 bg-gray-700"></div>
                    <div className="w-full h-0.5 bg-gray-700"></div>
                    <div className="w-full h-0.5 bg-gray-700"></div>
                </div>
            </button>
        </header>
    )
}
