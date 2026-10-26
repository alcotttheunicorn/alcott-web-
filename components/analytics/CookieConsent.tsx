'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  COOKIE_PREFERENCES_OPEN,
  getCookieConsent,
  setCookieConsent,
} from '@/lib/analytics/consent';
import { loadMetaPixel } from '@/lib/analytics/metaPixel';
import type { CookieConsentChoice } from '@/lib/analytics/consent';


export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = getCookieConsent();
    setMounted(true);
    setChoice(stored);
    if (stored === 'accepted') {
      loadMetaPixel();
    }
    // No decision yet -> show the banner on first load.
    setOpen(stored === null);
  }, []);

  // Re-open from anywhere (footer link, floating button, etc.).
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(COOKIE_PREFERENCES_OPEN, onOpen);
    return () => window.removeEventListener(COOKIE_PREFERENCES_OPEN, onOpen);
  }, []);

  const decide = (next: CookieConsentChoice) => {
    setCookieConsent(next);
    setChoice(next);
    setOpen(false);
    if (next === 'accepted') {
      // Loads fbevents.js + init + a PageView (idempotent).
      loadMetaPixel();
    }
    // On 'rejected' we simply don't load; trackMeta() is consent-gated so any
    // already-registered handlers become inert and no further events are sent.
  };

  const closeWithoutDeciding = () => setOpen(false);

  if (!mounted) return null;

  return (
    <>
      {open && (
        <div
          role="region"
          aria-label="Cookie preferences"
          className="fixed inset-x-0 bottom-0 z-80 px-4 pb-4 sm:pb-6"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-bold text-gray-900">Cookie preferences</h2>
              {choice !== null && (
                <button
                  type="button"
                  onClick={closeWithoutDeciding}
                  aria-label="Close"
                  className="-m-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              We use strictly necessary cookies to run this site. With your
              permission we also use analytics &amp; advertising cookies to
              measure activity and show you relevant ads. You can change this at
              any time. See our{' '}
              <Link href="/policies" className="font-semibold text-[#4043FF] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            {choice !== null && (
              <p className="mt-2 text-xs text-gray-500">
                Current choice:{' '}
                <span className="font-semibold capitalize">{choice === 'accepted' ? 'Accepted' : 'Declined'}</span>
              </p>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => decide('rejected')}
                className={`inline-flex h-11 items-center justify-center rounded-full border-2 px-6 text-sm font-semibold transition-colors ${
                  choice === 'rejected'
                    ? 'border-[#4043FF] bg-[#4043FF] text-white'
                    : 'border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white'
                }`}
              >
                Decline non-essential
              </button>
              <button
                type="button"
                onClick={() => decide('accepted')}
                className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-colors ${
                  choice === 'accepted'
                    ? 'bg-[#3333CC]'
                    : 'bg-[#4043FF] hover:bg-[#3333CC]'
                }`}
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
