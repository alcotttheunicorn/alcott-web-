export type CookieConsentChoice = 'accepted' | 'rejected';

const CONSENT_KEY = 'alcott_cookie_consent';

/** Current stored choice, or null if the user has not decided yet. */
export function getCookieConsent(): CookieConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'accepted' || v === 'rejected' ? v : null;
  } catch {
    // localStorage can throw in private mode / when disabled.
    return null;
  }
}

export function setCookieConsent(choice: CookieConsentChoice): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // ignore storage errors (private mode, quota)
  }
}

/** True only when the user has explicitly opted in. */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === 'accepted';
}


export const COOKIE_PREFERENCES_OPEN = 'alcott:open-cookie-preferences';

export function openCookiePreferences(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN));
}
