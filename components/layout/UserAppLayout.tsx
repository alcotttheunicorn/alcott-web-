'use client'

import { useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import { NAV_ITEMS, type UserNavKey } from '@/components/shared/nav-icons'
import { DesktopSidebar } from './DesktopSidebar'
import { MobileSidebar } from './MobileSidebar'
import { MobileBottomNav } from './MobileBottomNav'
import { AppHeader } from './AppHeader'

interface HeaderTitleConfig {
  title: string
  onBack?: () => void
}

interface UserAppLayoutProps {
  children: ReactNode
  activeNav?: UserNavKey
  headerTitle?: HeaderTitleConfig
  searchPlaceholder?: string
  searchOnNavigateToSearchPage?: boolean
  showCurrencySelector?: boolean
  showNotifications?: boolean
  showSearch?: boolean
  contentBgClass?: string
  inboxBadge?: boolean
}

function UserAppLayoutInner({
  children,
  activeNav,
  headerTitle,
  searchPlaceholder,
  searchOnNavigateToSearchPage = true,
  showCurrencySelector = true,
  showNotifications = true,
  showSearch = true,
  contentBgClass = 'bg-[#F8F9FA]',
  inboxBadge,
}: UserAppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { isAdmin } = useAuth()

  let resolvedActiveNav = activeNav
  if (!resolvedActiveNav) {
    for (const item of NAV_ITEMS) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        resolvedActiveNav = item.key
        break
      }
    }
  }

  const backHandler =
    headerTitle?.onBack !== undefined
      ? headerTitle.onBack
      : headerTitle
      ? () => router.back()
      : undefined

  return (
    <div className={`min-h-screen ${contentBgClass} flex flex-col`} style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
      <div className="flex flex-1 min-h-0">
        <DesktopSidebar activeNav={resolvedActiveNav} inboxBadge={inboxBadge} />
        {mobileMenuOpen && (
          <MobileSidebar onClose={() => setMobileMenuOpen(false)} activeNav={resolvedActiveNav} inboxBadge={inboxBadge} />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
            headerTitle={
              headerTitle
                ? { title: headerTitle.title, onBack: backHandler }
                : undefined
            }
            searchPlaceholder={searchPlaceholder}
            searchOnNavigateToSearchPage={searchOnNavigateToSearchPage}
            showCurrencySelector={showCurrencySelector}
            showNotifications={showNotifications}
            showSearch={showSearch}
            isAdmin={isAdmin}
          />

          <main className="flex-1 overflow-auto pb-20 lg:pb-6">
            {children}
          </main>

          <MobileBottomNav activeNav={resolvedActiveNav} />
        </div>
      </div>
    </div>
  )
}

export function UserAppLayout(props: UserAppLayoutProps) {
  return (
    <AuthGuard>
      <UserAppLayoutInner {...props} />
    </AuthGuard>
  )
}
