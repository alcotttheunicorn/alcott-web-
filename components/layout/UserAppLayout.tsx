'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import { useInboxUnread } from '@/hooks/use-support'
import { useProfile } from '@/hooks/use-profile'
import { isAdmin as hasAdminRole } from '@/lib/rbac'
import { NAV_ITEMS, type UserNavKey } from '@/components/shared/nav-icons'
import { DesktopSidebar } from './DesktopSidebar'
import { MobileSidebar } from './MobileSidebar'
import { MobileBottomNav } from './MobileBottomNav'
import { AppHeader } from './AppHeader'
import { ProfileWelcomeModal } from '@/components/shared/profile-welcome-modal'
import { VerifyPaymentHandler } from '@/components/wallet/verify-payment-handler'

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
  const { user } = useAuth()
  const isAdmin = hasAdminRole(user?.role)
  const inboxUnread = useInboxUnread()
  const resolvedInboxBadge = inboxBadge ?? inboxUnread

  
  const { profile, loading: profileLoading } = useProfile()
  const hasProfileName = Boolean(
    profile?.first_name?.trim() && profile?.last_name?.trim(),
  )
  const needsProfileSetup = !profileLoading && !hasProfileName && !isAdmin
  const [setupPromptedOnMount] = useState<boolean>(
    () => typeof window !== 'undefined' && sessionStorage.getItem('alcott_setupPrompted') === '1',
  )
  useEffect(() => {
    if (hasProfileName && setupPromptedOnMount) {
      sessionStorage.removeItem('alcott_setupPrompted')
    }
  }, [hasProfileName, setupPromptedOnMount])
  const returnedFromSetup = needsProfileSetup && setupPromptedOnMount
  const onLandingPage = pathname === '/home' || pathname === '/settings' || pathname === '/orders' || pathname === '/inbox'
  const showWelcomeModal = needsProfileSetup && onLandingPage && !returnedFromSetup
  const forceSetupRedirect = needsProfileSetup && (!onLandingPage || returnedFromSetup)

  useEffect(() => {
    if (forceSetupRedirect) {
      sessionStorage.setItem('alcott_setupPrompted', '1')
      router.replace('/profile-setup')
    }
  }, [forceSetupRedirect, router])

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

  // Don't paint the app shell while we're bouncing to setup.
  if (forceSetupRedirect) return null

  return (
    <div className={`min-h-screen ${contentBgClass} flex flex-col`}>
      <VerifyPaymentHandler />
      <ProfileWelcomeModal
        open={showWelcomeModal}
        onComplete={() => {
          sessionStorage.setItem('alcott_setupPrompted', '1')
          router.push('/profile-setup')
        }}
      />
      <div className="flex flex-1 min-h-0">
        <DesktopSidebar activeNav={resolvedActiveNav} inboxBadge={resolvedInboxBadge} />
        {mobileMenuOpen && (
          <MobileSidebar onClose={() => setMobileMenuOpen(false)} activeNav={resolvedActiveNav} inboxBadge={resolvedInboxBadge} />
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

          <MobileBottomNav activeNav={resolvedActiveNav} inboxBadge={resolvedInboxBadge} />
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
