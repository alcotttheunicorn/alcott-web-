import Link from 'next/link'
import { BRAND, benefits, storeLogos } from './constants'

export function HeroSection() {
  return (
    <section aria-label="Alcott shop and ship" className="bg-[#fafcfe]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        {/* Left copy */}
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
            style={{ backgroundColor: '#e8ebff', color: BRAND }}
          >
            ALCOTT SHOP &amp; SHIP
          </span>

          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-[1.05] text-[#080d20]">
            Shop the world.
          </h1>
          <p
            className="text-4xl sm:text-5xl font-extrabold leading-[1.05]"
            style={{ color: BRAND }}
          >
            We&apos;ll bring it home.
          </p>

          <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-[#747b8f]">
            Shop from your favourite US &amp; UK stores. Alcott estimates the
            weight, shipping, duties and delivery cost before you pay.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-[6px] text-sm font-bold text-white"
              style={{ backgroundColor: BRAND }}
            >
              Start Shopping&nbsp;&nbsp;→
            </Link>
            <a
              href="#order-builder"
              className="px-6 py-3 rounded-[6px] text-sm font-bold bg-white border"
              style={{ borderColor: '#9ba7ff', color: BRAND }}
            >
              Calculate Delivery
            </a>
          </div>

          {/* Three benefit pills */}
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#f0f3ff', color: BRAND }}
                >
                  <b.icon size={18} strokeWidth={2} aria-hidden />
                </span>
                <span className="text-xs sm:text-[13px] font-medium text-[#080d20] leading-snug">
                  {b.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right visual – replace src with your actual hero asset */}
        <div className="relative">
          <div
            className="absolute -top-4 -right-4 w-28 h-28 rounded-full opacity-60"
            style={{ backgroundColor: '#c0ddf4' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/shopping-parcel-scene.png"
            alt="Shopping parcels from Amazon, Zara, Nike, Apple being consolidated for delivery to Nigeria"
            className="relative w-full max-w-md mx-auto rounded-2xl border border-[#ebeefa] bg-white object-cover"
          />
        </div>
      </div>

      {/* Brand logos strip */}
      <div className="bg-[#f2f7fd]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {storeLogos.map((store) => (
            <span key={store.name} aria-label={store.name}>
              {store.node}
            </span>
          ))}
          <span className="text-xs text-[#747b8f]">and 1,000+ global stores</span>
        </div>
      </div>
    </section>
  )
}
