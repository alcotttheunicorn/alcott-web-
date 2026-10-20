'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BRAND, faqs } from './constants'

export function FaqSection() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section aria-labelledby="faq-title" className="bg-[#071b3d]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 lg:py-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left column */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#162d66] text-white text-[11px] font-bold tracking-wide">
            FAQ
          </span>

          <h2
            id="faq-title"
            className="mt-4 text-2xl sm:text-3xl font-extrabold text-white"
          >
            Frequently asked questions
          </h2>

          <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-[#cfd8ec]">
            Find quick answers to common questions about Alcott Shop &amp; Ship.
          </p>

          <a
            href="#faq-title"
            className="mt-6 inline-block px-5 py-2.5 rounded-full text-xs font-bold text-white border border-[#254066] hover:bg-[#0e2854] transition-colors"
          >
            View all FAQs&nbsp;&nbsp;→
          </a>

          {/* Support card */}
          <aside
            aria-label="Customer support"
            className="mt-8 max-w-[320px] rounded-md bg-[#0e2854] p-5"
          >
            <div
              className="w-9 h-9 rounded-md bg-white flex items-center justify-center"
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={BRAND}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">
              Still have questions?
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#cfd8ec]">
              Our team is here to help you shop and ship with confidence.
            </p>
            <Link
              href="/help"
              className="mt-4 inline-block px-4 py-2 rounded-full bg-white text-xs font-bold"
              style={{ color: BRAND }}
            >
              Contact Support&nbsp;&nbsp;→
            </Link>
          </aside>
        </div>

        {/* FAQ accordion */}
        <div role="list" aria-label="Frequently asked questions" className="lg:pt-2">
          {faqs.map((item, index) => {
            const isExpanded = expanded === index
            return (
              <div
                key={item.q}
                role="listitem"
                className="border-b border-[#254066]"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setExpanded(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4043FF] rounded"
                >
                  <span className="text-sm text-white">{item.q}</span>
                  <svg
                    className={`shrink-0 w-4 h-4 text-[#cfd8ec] transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isExpanded && (
                  <p
                    id={`faq-answer-${index}`}
                    className="pb-4 pr-8 text-sm leading-relaxed text-[#cfd8ec]"
                  >
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
