import { hasAnalyticsConsent } from './consent';

export const META_PIXEL_ID = '1434595618779239';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

let pixelInjected = false;

export function loadMetaPixel(): void {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  if (pixelInjected || typeof window.fbq === 'function') {
    pixelInjected = true;
    return;
  }
  pixelInjected = true;

  // Equivalent to Meta's copy-paste base code, expressed so it survives TS/ESM.
  const w = window as unknown as Record<string, any>;
  const doc = document;
  const fbq = function fbq() {
    // eslint-disable-next-line prefer-rest-params
    (fbq as any).callMethod
      ? (fbq as any).callMethod.apply(fbq, arguments)
      : (fbq as any).queue.push(arguments);
  } as any;
  if (!w._fbq) w._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  w.fbq = fbq;

  const s = doc.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const first = doc.getElementsByTagName('script')[0];
  first.parentNode!.insertBefore(s, first);

  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

/**
 * Fire a Meta Pixel standard or custom event. No-ops on the server, without
 * consent, or if the pixel has not been loaded yet.
 * @param event  e.g. 'PageView' | 'CompleteRegistration' | 'InitiateCheckout' | 'Purchase'
 * @param params optional event payload (value, currency, content_name, ...)
 */
export function trackMeta(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

export function trackPageView(): void {
  trackMeta('PageView');
}

export function trackCompleteRegistration(params?: Record<string, unknown>): void {
  trackMeta('CompleteRegistration', { content_name: 'signup', ...params });
}

export function trackInitiateCheckout(params?: Record<string, unknown>): void {
  trackMeta('InitiateCheckout', { content_name: 'shipment_booking', ...params });
}

export function trackAddPaymentInfo(params?: Record<string, unknown>): void {
  trackMeta('AddPaymentInfo', { content_name: 'shipment_booking', ...params });
}

/** High-intent pre-signup action (e.g. got a quote, clicked a CTA). */
export function trackLead(params?: Record<string, unknown>): void {
  trackMeta('Lead', params);
}

/** Returning user signed in — useful for retargeting existing customers. */
export function trackLogin(params?: Record<string, unknown>): void {
  trackMeta('Login', { content_name: 'sign_in', ...params });
}

/** Viewed a specific product/interest surface (shop-and-ship, etc.). */
export function trackViewContent(contentName: string, params?: Record<string, unknown>): void {
  trackMeta('ViewContent', { content_name: contentName, ...params });
}

/**
 * A completed, valuable action Meta can optimize ads toward.
 * @param opts.value    numeric worth of the conversion (in `currency` units)
 * @param opts.currency ISO code, defaults to NGN
 * @param opts.contentName distinguishes what was bought (booking vs top-up)
 */
export function trackPurchase(opts: {
  value?: number | null;
  currency?: string;
  contentName?: string;
} = {}): void {
  const { value, currency = 'NGN', contentName = 'shipment_booking' } = opts;
  trackMeta('Purchase', {
    content_name: contentName,
    currency,
    ...(typeof value === 'number' && Number.isFinite(value) ? { value } : {}),
  });
}
