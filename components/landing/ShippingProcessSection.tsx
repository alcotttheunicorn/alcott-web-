type ProcessIconName = 'document' | 'quote' | 'truck' | 'box'

type ProcessStep = {
  number: string
  title: string
  description: string
  icon: ProcessIconName
};

const processSteps: ProcessStep[] = [
  { number: '1', title: 'Request', description: "Tell us what you're shipping and where it needs to go.", icon: 'document' },
  { number: '2', title: 'Quote', description: 'We recommend the best shipping option and provide your price.', icon: 'quote' },
  { number: '3', title: 'Pickup & Ship', description: 'We collect your shipment and handle transportation, documentation and customs.', icon: 'truck' },
  { number: '4', title: 'Deliver', description: 'We deliver to the final destination, on time.', icon: 'box' },
]

export function ShippingProcessSection() {
  return (
    <section
      aria-labelledby="shipping-process-heading"
      className="w-full bg-white py-14 lg:py-20
    ">
      <div className="max-w-9xl mx-auto px-4 lg:px-12 flex flex-col gap-3">
        <div className="text-[#4043ff] text-[11px] font-bold tracking-[0.88px] [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]">
          HOW IT WORKS
        </div>
        <h2
          id="shipping-process-heading"
          className="text-[#0d1124] text-[24px] sm:text-[28px] lg:text-[30px] font-bold tracking-[-0.3px] [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]"
        >
          A simple, end-to-end process.
        </h2>

        {/* Desktop row with dashed connector */}
        <div className="hidden lg:block relative mt-12">
          {/* Dashed connector line */}
          <div
            className="absolute top-[15px] left-[15px] right-[15px] border-t border-dashed border-[#b8c4e8]"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                {/* Numbered circle + icon circle */}
                <div className="flex items-center gap-[72px]">
                  <div className="relative z-10 flex w-[31px] h-[31px] items-center justify-center bg-[#4043ff] rounded-full shrink-0">
                    <span className="text-white text-xs font-bold [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]">
                      {step.number}
                    </span>
                  </div>
                  <div className="relative z-10 flex w-[54px] h-[54px] items-center justify-center bg-[#f8faff] rounded-full border border-[#d7e0ff] shrink-0 -mt-[11px]">
                    <ProcessIcon name={step.icon} className="w-6 h-6 text-[#4043ff]" />
                  </div>
                </div>

                {/* Title + description */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0d1124] text-sm font-bold [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]">
                    {step.title}
                  </h3>
                  <p className="text-[#5b6070] text-[11px] leading-[1.48] max-w-[220px] [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="lg:hidden flex flex-col gap-8 mt-8">
          {processSteps.map((step) => (
            <div key={step.number} className="flex items-start gap-4">
              <div className="relative flex flex-col items-center shrink-0">
                <div className="flex w-[31px] h-[31px] items-center justify-center bg-[#4043ff] rounded-full">
                  <span className="text-white text-xs font-bold [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]">
                    {step.number}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex w-[44px] h-[44px] items-center justify-center bg-[#f8faff] rounded-full border border-[#d7e0ff]">
                    <ProcessIcon name={step.icon} className="w-5 h-5 text-[#4043ff]" />
                  </div>
                  <h3 className="text-[#0d1124] text-sm font-bold [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-[#5b6070] text-[11px] leading-[1.48] [font-family:Plus_Jakarta_Sans',system-ui,sans-serif]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessIcon({
  name,
  className,
}: {
  name: ProcessIconName
  className?: string
}) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (name === 'document') {
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    )
  }

  if (name === 'quote') {
    return (
      <svg {...common}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
        <path d="M12 8v4" />
        <circle cx="12" cy="15" r="0.5" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'truck') {
    return (
      <svg {...common}>
        <path d="M3 6h11v10H3z" />
        <path d="M14 9h4l3 3v4h-7" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    )
  }

  // box
  return (
    <svg {...common}>
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5Z" />
      <path d="M3.3 7 12 12l8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}