import { BRAND, featureItems, productDetails } from './constants'

export function SmartWeightSection() {
  return (
    <section
      aria-labelledby="smart-weight-estimation-title"
      className="bg-[#f3f8fe] border-t-[0.5px] border-[#dde2eb]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 lg:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
            style={{ backgroundColor: '#e8ebff', color: BRAND }}
          >
            AI POWERED
          </span>
          <h2
            id="smart-weight-estimation-title"
            className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#080d20]"
          >
            Smart weight estimation
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#747b8f]">
            Our AI reads the product page, estimates the shipping weight and
            builds your landed cost — before you commit to buying.
          </p>
          <ul className="mt-6 space-y-2.5">
            {featureItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-[#080d20]"
              >
                <span
                  className="mt-0.5 w-5 h-5 shrink-0 rounded-full text-white text-[10px] flex items-center justify-center"
                  style={{ backgroundColor: BRAND }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <article
          aria-label="Product weight estimation"
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#080d20]">
              Apple AirPods Max - USB-C
            </h3>
            <span className="text-[11px] text-[#747b8f]">Amazon (US)</span>
          </div>
          <div className="mt-4 space-y-3">
            {productDetails.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between gap-3 text-[13px]"
              >
                <span className="text-[#747b8f]">{d.label}</span>
                <span className="font-semibold text-[#080d20]">
                  {d.value}
                  {d.confidence && (
                    <span className="ml-2 rounded bg-[#e7fff1] px-2 py-0.5 text-[10px] font-normal text-[#368873]">
                      {d.confidence}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[6px] bg-[#f0f2ff] p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-[#080d20]">
              Landed cost estimate
            </span>
            <span className="text-sm font-extrabold" style={{ color: BRAND }}>
              ₦1,120,000
            </span>
          </div>
        </article>
      </div>
    </section>
  )
}
