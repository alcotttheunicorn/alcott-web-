'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackSiteVisit } from '@/lib/analytics/visitTracker';

/**
 * Reports a first-party page view on initial load and on every route change.
 * Uses only `usePathname` (not `useSearchParams`) so it does not force an SSG
 * client-side bailout and can live in the root layout without a Suspense
 * wrapper. The beacon itself is fire-and-forget and consent-independent.
 */
export function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    trackSiteVisit(pathname);
  }, [pathname]);

  return null;
}
