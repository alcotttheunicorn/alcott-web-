'use client'

import { useState } from 'react'

type FrequentlyAskedQuestion = { question: string; answer: string }

const frequentlyAskedQuestions: FrequentlyAskedQuestion[] = [
  { question: 'How do I get a quote for shipping?', answer: 'Enter your shipment details in the web app to receive an estimated shipping quote.' },
  { question: 'How long does the shipping take?', answer: 'Delivery times vary depending on the destination, shipment size, and selected shipping method.' },
  { question: 'Where can i ship foodstuff to?', answer: 'You can ship foodstuff to available destinations supported by our shipping network.' },
  { question: 'What food stuff can I not ship?', answer: 'Restricted food items depend on local regulations, destination requirements, and carrier policies.' },
  { question: 'What is the price of cargo shipping?', answer: 'Cargo shipping prices are calculated using shipment size, weight, destination, and delivery speed.' },
  { question: 'How much is the custom duties charge?', answer: 'Customs duties vary by destination and are based on the declared value and type of goods.' },
  { question: 'How can I use the web app?', answer: 'Create an account, enter your shipment details, and follow the steps to arrange delivery.' },
]

export function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const toggleQuestion = (i: number) =>
    setOpenQuestion((cur) => (cur === i ? null : i))

  return (
    <section
      aria-labelledby="frequently-asked-questions-title"
      className="w-full bg-white py-14 lg:py-20
    ">
      <div className="max-w-9xl mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 lg:gap-16 items-center">
          {/* Left: phone overflowing the red circle */}
            <div className="relative flex items-center justify-center h-80 sm:h-[420px] lg:h-[560px]">
            {/* Red circle — centered, hidden on mobile */}
            <div
                className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] xl:w-[440px] xl:h-[440px] bg-[#fe2c31] rounded-full"
                aria-hidden="true"
            />
            {/* Phone — larger than circle, centered, overflows */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/iphone-x.png"
                alt="Alcott mobile app tracking screen"
                className="relative z-10 w-[260px] sm:w-[320px] lg:w-[420px] xl:w-[460px] h-auto"
            />
            </div>

          {/* Right: heading + FAQ accordion */}
          <div className="flex flex-col items-start gap-8 lg:gap-10">
            <header className="flex flex-col gap-3 text-left">
              <h2
                id="frequently-asked-questions-title"
                className="text-gray-900 text-[28px] sm:text-[36px] lg:text-[42px] font-bold leading-tight 
              ">
                Got questions? We have answers for you
              </h2>
              <p className="text-gray-600 text-base lg:text-lg ">
                Everything you need to know about our shipping, pricing and
                platform.
              </p>
            </header>

            <div className="w-full border-t border-gray-200">
              {frequentlyAskedQuestions.map((item, index) => {
                const isOpen = openQuestion === index
                const answerId = `faq-answer-${index}`
                return (
                  <div
                    key={item.question}
                    className="w-full border-b border-gray-200
                  ">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      onClick={() => toggleQuestion(index)}
                    >
                      <span className="text-[#1f1f1f] text-base sm:text-lg ">
                        {item.question}
                      </span>
                      <span
                        className={`shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path
                            d="m8 11 4 4 4-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <p
                        id={answerId}
                        className="pb-5 text-gray-600 text-[15px] leading-6 
                      ">
                        {item.answer}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}