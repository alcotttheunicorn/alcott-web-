'use client';

import { openCookiePreferences } from '@/lib/analytics/consent';


export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => openCookiePreferences()}
      className={className}
    >
      Cookie preferences
    </button>
  );
}
