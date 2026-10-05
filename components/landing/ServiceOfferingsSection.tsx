// import { ServiceOfferingsSection as _Unused } from '@/components/landing/_anima-ignore' // remove after deleting anima files

type ServiceOffering = {
  title: string
  description: string
  highlighted: boolean
  icon: 'truck' | 'box' | 'boxTick'
}

const serviceOfferings: ServiceOffering[] = [
  {
    title: 'Nationwide Deliveries',
    description:
      'Fast, reliable deliveries across every state in Nigeria. From instant same-day drop-offs to scheduled interstate shipping, Alcott gets your packages where they need to be.',
    highlighted: false,
    icon: 'truck',
  },
  {
    title: 'Export & Import Deliveries',
    description:
      'Ship goods in and out of Nigeria without stress. We handle pickup, international movement, and last-mile delivery straight to your doorstep.',
    highlighted: true,
    icon: 'box',
  },
  {
    title: 'Global Freight & Customs',
    description:
      'Moving large cargo or complex shipments? Alcott manages air and sea freight worldwide, including customs documentation and clearance.',
    highlighted: false,
    icon: 'boxTick',
  },
]

export function ServiceOfferingsSection() {
  return (
    <section
      aria-labelledby="service-offerings-title"
      className="w-full bg-white py-14 lg:py-20
    ">
      <div className="max-w-9xl mx-auto px-4 lg:px-12 flex flex-col items-center gap-10 lg:gap-14">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4043ff1a] rounded-[100px]">
            <span className="text-[#4043ff] text-[13px] font-semibold ">
              OUR SERVICES
            </span>
          </div>
          <h2
            id="service-offerings-title"
            className="text-[#12141d] text-[32px] lg:text-[44px] font-bold text-center leading-tight 
          ">
            What We Offer
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {serviceOfferings.map((service) => {
            const cardClass = service.highlighted
              ? 'flex flex-col items-start gap-5 p-8 bg-[#4043ff] rounded-2xl'
              : 'flex flex-col items-start gap-5 p-8 bg-white rounded-2xl shadow-[0px_4px_40px_#23286914]'
            const iconWrapClass = service.highlighted
              ? 'flex w-14 h-14 items-center justify-center bg-[#ffffff20] rounded-2xl'
              : 'flex w-14 h-14 items-center justify-center bg-[#4043ff1a] rounded-2xl'
            const titleClass = service.highlighted
              ? 'text-white text-xl font-bold '
              : 'text-[#12141d] text-xl font-bold '
            const descClass = service.highlighted
              ? 'text-[#ffffffb3] text-[15px] leading-6 '
              : 'text-gray-500 text-[15px] leading-6 '
            const linkClass = service.highlighted
              ? 'text-white text-sm font-semibold '
              : 'text-[#4043ff] text-sm font-semibold '

            return (
              <article className={cardClass} key={service.title}>
                <div className={iconWrapClass}>
                  <ServiceIcon
                    name={service.icon}
                    className={service.highlighted ? 'text-white' : 'text-[#4043ff]'}
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <h3 className={titleClass}>{service.title}</h3>
                  <p className={descClass}>{service.description}</p>
                </div>
                <a
                  href="#"
                  aria-label={`Learn more about ${service.title}`}
                  className="inline-flex items-center gap-1.5
                ">
                  <span className={linkClass}>Learn more</span>
                  <span aria-hidden="true" className={linkClass}>→</span>
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ServiceIcon({ name, className }: { name: 'truck' | 'box' | 'boxTick'; className?: string }) {
  const common = { className: `w-8 h-8 ${className ?? ''}`, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'truck') {
    return (
      <svg {...common}>
        <path d="M1 3h13v13H1z" /><path d="M14 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  }
  if (name === 'box') {
    return (
      <svg {...common}>
        <path d="M21 16V8l-9-5-9 5v8l9 5 9-5Z" /><path d="M3.3 7 12 12l8.7-5" /><path d="M12 22V12" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5Z" /><path d="M3.3 7 12 12l8.7-5" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </svg>
  )
}