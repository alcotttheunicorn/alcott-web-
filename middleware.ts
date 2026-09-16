import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/lets-get-you-in',
  '/sign-in',
  '/register',
  '/forgot-password',
  '/verify-email',
  '/(auth)',
]

// Auth routes that redirect authenticated users to home
const authRoutes = [
  '/lets-get-you-in',
  '/sign-in',
  '/register',
  '/(auth)',
]

// Admin routes that require admin role
const adminRoutes = [
  '/admin',
]

// Helper function to check if path matches a route pattern
function matchesRoute(pathname: string, route: string): boolean {
  if (route.endsWith(')')) {
    // Route group pattern: /(auth) matches /auth/sign-in, /auth/register, etc.
    const routeGroup = route.slice(1, -1) // Remove parentheses
    return pathname.startsWith(`/${routeGroup}`)
  }
  return pathname === route || pathname.startsWith(route + '/')
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookies (server-side)
  const token = request.cookies.get('authToken')?.value

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(route => matchesRoute(pathname, route))

  // Check if the path is an auth route (should redirect authenticated users)
  const isAuthRoute = authRoutes.some(route => matchesRoute(pathname, route))

  // Check if the path is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // Protect non-public routes
  if (!isPublicRoute && !token) {
    // Store the original URL for redirect after login
    const loginUrl = new URL('/lets-get-you-in', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Protect admin routes - check for admin role
  if (isAdminRoute && token) {
    // For admin routes, we need to check the user's role
    // Since cookies might be large, we'll do a basic check here
    // and let client-side RoleGuard handle detailed validation
    const userCookie = request.cookies.get('authUser')?.value
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie))
        if (user.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/home', request.url))
        }
      } catch {
        // Invalid user data, redirect to home
        return NextResponse.redirect(new URL('/home', request.url))
      }
    } else {
      // No user data, redirect to home
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any path containing a dot (.*\\..*) — i.e. static assets. Public
     *   assets are served from the root (e.g. /alcott-logo.png,
     *   /icons/truck-icon.png), NOT under /public, so excluding the literal
     *   "public" segment never matched them. Without this, middleware
     *   redirected unauthenticated image requests to the login page,
     *   breaking every image on public pages.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
