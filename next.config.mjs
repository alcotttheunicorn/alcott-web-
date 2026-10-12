/** @type {import('next').NextConfig} */

// The deployed backend only allows the production origin in its CORS allowlist,
// so direct browser calls from localhost get blocked. In development we route
// API calls through a same-origin Next.js rewrite (/api-proxy/*) which proxies
// server-to-server to the backend, sidestepping CORS entirely. Production uses
// the absolute NEXT_PUBLIC_API_BASE_URL and never hits this path.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Dev-only: the /api-proxy pass-through must NOT exist in production, or it
    // becomes an open relay to the backend. Prod calls the backend directly.
    if (process.env.NODE_ENV !== 'development') return []
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${API_BASE_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
