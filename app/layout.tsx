import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'

import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { MetaPixelPageView } from '@/components/analytics/MetaPixelPageView'
import { CookieConsent } from '@/components/analytics/CookieConsent'
import { QueryProvider } from '@/components/providers/query-provider'
import { CurrencyProvider } from '@/components/providers/currency-provider'
import { AuthHydrator } from '@/components/providers/auth-hydrator'
import './globals.css'

// Import Urbanist font from Google Fonts with fallback
import { Urbanist } from 'next/font/google'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
});

export const metadata: Metadata = {
  title: 'Alcott Shipping Service',
  description: 'Ship and track packages worldwide with Alcott.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Urbanist font fallback for SSR */}
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={urbanist.className}>
        <QueryProvider>
          <CurrencyProvider>
            <AuthHydrator>
              {children}
            </AuthHydrator>
          </CurrencyProvider>
        </QueryProvider>
        <Toaster />
        <Analytics />

        {/* Consent-gated Meta Pixel. Suspense isolates MetaPixelPageView's
            useSearchParams() so the rest of the tree still statically prerenders. */}
        <Suspense fallback={null}>
          <MetaPixelPageView />
        </Suspense>
        <CookieConsent />
      </body>
    </html>
  )
}