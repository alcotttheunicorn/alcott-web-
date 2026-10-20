import { Calculator, Link2, ShoppingBag } from 'lucide-react'
import { BRAND } from './constants'

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-14 h-14 rounded-full bg-[#f2f7fd] flex items-center justify-center"
      style={{ color: BRAND }}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}

function NigeriaFlag() {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      className="ml-1 rounded-[2px] shadow-sm"
      aria-hidden="true"
    >
      <rect width="6" height="12" fill="#008751" />
      <rect x="6" width="6" height="12" fill="#ffffff" />
      <rect x="12" width="6" height="12" fill="#008751" />
    </svg>
  )
}

function StepArrow() {
  return (
    <svg
      className="hidden lg:block absolute -right-4 top-[38px] w-6 h-6 shrink-0"
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
  )
}

export function HowItWorksSection() {
  return (
    <section aria-labelledby="how-it-works-title" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 lg:py-20">
        <span
          className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
          style={{ backgroundColor: '#e8ebff', color: BRAND }}
        >
          SIMPLE. TRANSPARENT. RELIABLE.
        </span>

        <h2
          id="how-it-works-title"
          className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#080d20]"
        >
          How It Works
        </h2>

        <ol className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Step 1 */}
          <li className="relative lg:pr-6">
            <StepArrow />
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center"
                style={{ backgroundColor: BRAND }}
              >
                1
              </span>
              <StepIcon>
                <ShoppingBag size={24} strokeWidth={2} />
              </StepIcon>
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#080d20]">Shop</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#747b8f]">
              Visit your favourite stores like Amazon, Zara, Apple and more. Add
              items to your cart.
            </p>
          </li>

          {/* Step 2 */}
          <li className="relative lg:pr-6">
            <StepArrow />
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center"
                style={{ backgroundColor: BRAND }}
              >
                2
              </span>
              <StepIcon>
                <Link2 size={24} strokeWidth={2} />
              </StepIcon>
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#080d20]">Add to Alcott</h3>
            <div className="mt-3 flex items-center gap-2 rounded-[6px] border border-[#dde2eb] bg-white px-3 py-2 max-w-[240px]">
              <span className="flex-1 truncate text-xs text-[#747b8f]">
                https://www.amazon.com/dp/...
              </span>
              <span
                className="w-5 h-5 rounded-[3px] flex items-center justify-center text-white text-[10px]"
                style={{ backgroundColor: BRAND }}
              >
                →
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#747b8f]">
              Paste product links or add items to your cart on Alcott. Our AI
              analyzes the product information.
            </p>
          </li>

          {/* Step 3 */}
          <li className="relative">
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center"
                style={{ backgroundColor: BRAND }}
              >
                3
              </span>
              <StepIcon>
                <Calculator size={24} strokeWidth={2} />
              </StepIcon>
              <NigeriaFlag />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#080d20]">See your total</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#747b8f]">
              We estimate the weight, shipping, duties and delivery cost to
              Nigeria — upfront, before you pay.
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}
