import { BRAND, cartProducts, consolidationFeatures } from './constants'

export function ConsolidationSection() {
  return (
    <section aria-labelledby="multi-store-heading" className="bg-[#fafcfe]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 lg:py-20">
        {/* One cart. Multiple stores. */}
        <span
          className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
          style={{ backgroundColor: '#e8ebff', color: BRAND }}
        >
          CONSOLIDATE &amp; SAVE
        </span>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2
              id="multi-store-heading"
              className="text-2xl sm:text-3xl font-extrabold text-[#080d20]"
            >
              One cart. Multiple stores.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#747b8f]">
              Shop from different stores, ship to your Alcott address and
              we&apos;ll consolidate everything into one shipment to save you
              money.
            </p>
          </div>

          {/* Mini product cards → consolidated box */}
          <div className="flex flex-wrap items-center gap-3">
            {cartProducts.map((p) => (
              <div
                key={p.store}
                className="shrink-0 w-[92px] rounded-[10px] bg-white border border-[#ebeefa] p-2.5 text-center shadow-sm"
                aria-label={`${p.store}, ${p.price}`}
              >
                <div
                  className="h-14 rounded-md bg-[#f2f7fd] flex items-center justify-center text-2xl"
                  aria-hidden="true"
                >
                  {p.emoji}
                </div>
                <div className="mt-2 text-[13px] font-bold text-[#080d20]">
                  {p.price}
                </div>
                <div className="text-[10px] text-[#747b8f] leading-tight">
                  {p.store}
                </div>
              </div>
            ))}

            <svg
              className="shrink-0 w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke={BRAND}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>

            <div className="shrink-0 w-[120px] rounded-[10px] bg-white border border-[#ebeefa] p-3 text-center shadow-sm">
              <div
                className="h-14 rounded-md bg-[#f0f3ff] flex items-center justify-center text-2xl"
                aria-hidden="true"
              >
                📦
              </div>
              <div className="mt-2 text-[11px] font-bold text-[#080d20] leading-snug">
                Consolidated into one shipment
                <br />
                delivered to Nigeria
              </div>
            </div>
          </div>
        </div>

        {/* Why Shop & Ship with Alcott? */}
        <div className="mt-16 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="lg:w-[240px] lg:shrink-0">
            <span
              className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
              style={{ backgroundColor: '#e8ebff', color: BRAND }}
            >
              MORE THAN A FORWARDER
            </span>
            <h3 className="mt-3 text-xl sm:text-2xl font-extrabold text-[#080d20]">
              Why Shop &amp; Ship with Alcott?
            </h3>
          </div>

          <ul className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
            {consolidationFeatures.map((f) => (
              <li key={f.title}>
                <span
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#f0f3ff', color: BRAND }}
                >
                  <f.icon size={20} strokeWidth={2} aria-hidden />
                </span>
                <h4 className="mt-3 text-sm font-bold text-[#080d20]">
                  {f.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#747b8f]">
                  {f.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
