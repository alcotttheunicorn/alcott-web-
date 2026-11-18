// Client-side Site Visit beacon builder.
//
// This is intentionally fire-and-forget: it never throws to the caller and
// never blocks rendering. Matches the backend contract (POST /analytics/visits),
// supplies a stable per-tab session_id, derives device/browser/OS from the UA,
// forwards referrer + UTM, and lets the server resolve country (cf-ipcountry).
//
// Unlike the Meta Pixel this is first-party, IP-less, privacy-preserving
// analytics, so it is NOT gated behind the cookie-consent banner.

import { recordVisit, type VisitPayload } from '@/lib/api/analytics-api';

const SESSION_KEY = 'alcott_site_session_id';

function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to manual id
  }
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Stable id for the lifetime of this browser tab (sessionStorage). */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = newId();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // sessionStorage disabled (private mode) — still return an ephemeral id.
    return newId();
  }
}

function detectDeviceType(ua: string): string {
  const isTablet =
    /iPad/.test(ua) ||
    (/Android/.test(ua) && !/Mobile/.test(ua)) ||
    (/Macintosh/.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1);
  if (/Mobi|Android|iPhone|iPod/.test(ua) && !isTablet) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\/|Opera/.test(ua)) return 'Opera';
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet';
  if (/Chrome/.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
  if (/Chromium/.test(ua)) return 'Chromium';
  if (/Firefox/.test(ua)) return 'Firefox';
  if (/Safari/.test(ua)) return 'Safari';
  if (/MSIE|Trident/.test(ua)) return 'Internet Explorer';
  return 'Other';
}

function detectOS(ua: string): string {
  if (/Windows NT 10/.test(ua)) return 'Windows';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Android/.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Mac OS X/.test(ua)) return 'macOS';
  if (/CrOS/.test(ua)) return 'Chrome OS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Other';
}

function readUtm(search: string): Pick<VisitPayload, 'utm_source' | 'utm_medium' | 'utm_campaign'> {
  try {
    const p = new URLSearchParams(search);
    const src = p.get('utm_source') ?? undefined;
    const med = p.get('utm_medium') ?? undefined;
    const camp = p.get('utm_campaign') ?? undefined;
    return { utm_source: src, utm_medium: med, utm_campaign: camp };
  } catch {
    return {};
  }
}

// Client-side mirror of the server's 2s dedup, to avoid double-fires from
// StrictMode remounts or rapid identical navigations.
let lastKey = '';
let lastTs = 0;

/** Builds the visit payload and posts it, swallowing every error. */
export function trackSiteVisit(path: string): void {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const key = `${path}`;
  if (key === lastKey && now - lastTs < 2000) return;
  lastKey = key;
  lastTs = now;

  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const payload: VisitPayload = {
      path,
      session_id: getSessionId(),
      device_type: detectDeviceType(ua),
      browser: detectBrowser(ua),
      os: detectOS(ua),
      ...(document.referrer ? { referrer: document.referrer } : {}),
      ...readUtm(window.location.search),
    };
    // Fire-and-forget: catch to satisfy no-floating-promises and stay silent.
    void recordVisit(payload).catch(() => {});
  } catch {
    // Analytics must never crash the app.
  }
}
