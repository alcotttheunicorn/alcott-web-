'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { BRAND } from './constants'

export function OrderBuilderSection() {
  const [productUrl, setProductUrl] = useState(
    'https://www.amazon.com/dp/B0CX1...'
  )
  const [quantity, setQuantity] = useState('1')
  const [store, setStore] = useState('Amazon (US)')
  const [city, setCity] = useState('Lagos')
  const [estimated, setEstimated] = useState(false)

  const labelCls = 'block text-xs font-semibold text-black mb-1.5'
  const fieldCls =
    'w-full rounded-[6px] border border-[#dde2eb] bg-white px-3 py-2.5 text-sm text-[#080d20] outline-none focus:border-[#9ba7ff]'
  const selectCls =
    'w-full appearance-none rounded-[6px] border border-[#dde2eb] bg-white px-3 py-2.5 pr-9 text-sm text-[#080d20] outline-none focus:border-[#9ba7ff]'

  return (
    <section
      id="order-builder"
      aria-label="Order builder"
      className="bg-[#f2f7fd]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 lg:py-20 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Build form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setEstimated(true)
          }}
          className="rounded-xl bg-white p-6 sm:p-8 shadow-sm"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
            style={{ backgroundColor: '#e8ebff', color: BRAND }}
          >
            GET AN ESTIMATE
          </span>

          <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-[#080d20]">
            Build your order
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#747b8f]">
            Paste product links from any US or UK store and get an instant
            landed-cost estimate to Nigeria.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="product-url" className={labelCls}>
                Product URL
              </label>
              <input
                id="product-url"
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className={fieldCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="store-country" className={labelCls}>
                  Store / Country
                </label>
                <div className="relative">
                  <select
                    id="store-country"
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    className={selectCls}
                  >
                    <option value="Amazon (US)">Amazon — US</option>
                    <option value="Amazon (UK)">Amazon — UK</option>
                    <option value="Zara (UK)">Zara — UK</option>
                    <option value="Apple (US)">Apple — US</option>
                    <option value="Nike (US)">Nike — US</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#747b8f]"
                    aria-hidden
                  />
                </div>
              </div>
              <div>
                <label htmlFor="quantity" className={labelCls}>
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={fieldCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="delivery-city" className={labelCls}>
                Delivery city in Nigeria
              </label>
              <input
                id="delivery-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={fieldCls}
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-4 text-sm font-semibold"
            style={{ color: BRAND }}
          >
            + Add another item
          </button>

          <button
            type="submit"
            className="mt-6 w-full sm:w-auto px-8 py-3 rounded-[6px] text-sm font-bold text-white"
            style={{ backgroundColor: BRAND }}
          >
            Get Estimate&nbsp;&nbsp;→
          </button>

          {estimated && (
            <p
              role="status"
              className="mt-3 text-xs font-semibold"
              style={{ color: BRAND }}
            >
              Estimate refreshed from the current summary.
            </p>
          )}
        </form>

        {/* Order Summary card */}
        <aside
          aria-label="Order summary"
          className="rounded-xl bg-white p-6 shadow-sm flex flex-col"
        >
          <h2 className="text-sm font-bold text-[#080d20]">
            Order Summary (Estimate)
          </h2>

          <div className="mt-3 flex gap-3 rounded-[6px] border border-[#dde2eb] p-3">
            <div
              className="w-[58px] h-[58px] shrink-0 rounded bg-[#f2f7fd] flex items-center justify-center text-2xl"
              aria-hidden="true"
            >
              🎧
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#080d20] truncate">
                Apple AirPods Max - USB-C
              </p>
              <p className="mt-0.5 text-[11px] text-[#747b8f]">From {store}</p>
              <p className="text-[13px] font-bold text-[#080d20]">$549.00</p>
              <p className="text-[11px] text-[#747b8f]">
                Qty: {quantity || '1'} · Deliver to {city}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2 rounded-[6px] bg-[#f0f3ff] px-3 py-2.5">
            <span aria-hidden="true">⚖️</span>
            <span className="flex-1 text-xs font-semibold text-[#080d20]">
              Estimated weight: 1.2 kg
            </span>
            <span className="rounded-[5px] bg-[#e7fff1] px-2 py-1 text-[10px] text-[#368873]">
              ◉ 95% confidence
            </span>
          </div>

          <dl className="mt-3 space-y-1.5 text-[13px]">
            {[
              ['Product cost (USD)', '$549.00'],
              ['Estimated international shipping', '$85.00'],
              ['Estimated customs duties & taxes  ⓘ', '$78.50'],
              ['Alcott service fee', '$25.00'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-[#080d20]">{label}</dt>
                <dd className="text-[#080d20] text-right">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-3 rounded-[6px] bg-[#f0f2ff] p-3 flex items-center justify-between">
            <span className="text-sm font-bold text-[#080d20]">
              Total estimated cost
            </span>
            <span className="text-right">
              <span
                className="block text-base font-extrabold"
                style={{ color: BRAND }}
              >
                ₦1,120,000
              </span>
              <span className="block text-[11px] text-[#747b8f]">
                (~ $737.50)
              </span>
            </span>
          </div>

          <p className="mt-2.5 text-[11px] leading-snug text-[#747b8f]">
            Final cost may vary based on actual weight, customs assessment and
            additional charges. This is an estimate only.
          </p>

          <Link
            href="/register"
            className="mt-4 w-full text-center px-6 py-3 rounded-[6px] text-sm font-bold text-white"
            style={{ backgroundColor: BRAND }}
          >
            Continue to checkout&nbsp;&nbsp;→
          </Link>
        </aside>
      </div>
    </section>
  )
}
