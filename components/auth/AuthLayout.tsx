import type { ReactNode } from 'react'
import Link from 'next/link'

interface AuthHeader {
    backHref: string
    title: string
}

interface AuthLayoutProps {
    title?: string
    illustration?: string
    illustrationAlt?: string
    header?: AuthHeader
    children: ReactNode
}

export function AuthLayout({ title, illustration = '/lets_get_you_in.png', illustrationAlt = 'Illustration', header, children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {header ? (
                <div className="flex items-center px-6 py-4 border-b border-gray-100">
                    <Link href={header.backHref} className="mr-4">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                        {header.title}
                    </h1>
                </div>
            ) : (
                <div className="absolute top-6 left-6 lg:top-8 lg:left-8 z-10">
                    <img src="/alcott-small.png" alt="Alcott Logo" className="h-8 lg:h-10 w-auto" />
                </div>
            )}

            <div className="flex-1 flex">
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                    <div className="max-w-lg text-center">
                        <img src={illustration} alt={illustrationAlt} className="w-full h-auto max-w-md mx-auto" />
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-20 lg:pt-8">
                    <div className="w-full max-w-md">
                        <div className="lg:hidden flex justify-center mb-8">
                            <img src={illustration} alt={illustrationAlt} className="w-64 h-auto" />
                        </div>

                        {title && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center lg:text-left" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                    {title}
                                </h2>
                            </div>
                        )}

                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
