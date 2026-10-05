type Testimonial = { quote: string; name: string; role: string; featured: boolean }

const testimonials: Testimonial[] = [
  {
    quote:
      'Alcott handled a 500kg drilling equipment shipment for us from Aberdeen to Port Harcourt. The entire process — including customs and final delivery — was completed in just 5 days.',
    name: 'Eddie Osarenkhoe',
    role: 'Managing Director, Serock Energy Services Limited',
    featured: false,
  },
  {
    quote:
      'Our clinic regularly imports orthopedic implants from manufacturers in France and Italy. Alcott has consistently delivered, even on time-critical shipments — including a delivery completed within 48 hours.',
    name: 'Joseph Ojile',
    role: 'Founder, CEO, Forwardlong Orthopedics',
    featured: true,
  },
  {
    quote:
      "We've trusted Alcott with multiple imports from South Africa, South Korea, India, the UK, USA, Norway, France, Italy, and Belgium — moving over 10,000kg. Every shipment was delivered securely and on schedule.",
    name: 'Gladys Inyaka',
    role: 'Expediting Officer, Kevog Corporate Services',
    featured: false,
  },
]

export function CustomerTestimonialsSection() {
  return (
    <section
      aria-labelledby="customer-testimonials-heading"
      className="w-full bg-white py-14 lg:py-20
    ">
      <div className="max-w-9xl mx-auto px-4 lg:px-12 flex flex-col items-center gap-10 lg:gap-14">
        <h2
          id="customer-testimonials-heading"
          className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-center leading-tight 
        ">
          <span className="text-[#12141d]">Don&apos;t just take our word for it, </span>
          <span className="text-[#4043ff]">See for yourself.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {testimonials.map((t) => {
            const cardClass = t.featured
              ? 'flex flex-col items-start gap-6 p-9 bg-[#4043ff] rounded-[20px] shadow-[0px_8px_40px_#4043ff40]'
              : 'flex flex-col items-start gap-6 p-9 bg-white rounded-[20px] shadow-[0px_4px_30px_#12161c1a]'
            const starClass = t.featured ? 'text-white text-xl' : 'text-amber-500 text-xl'
            const quoteClass = t.featured
              ? 'text-[#ffffffcc] text-[15px] leading-7 '
              : 'text-gray-700 text-[15px] leading-7 '
            const nameClass = t.featured
              ? 'text-white text-base font-bold '
              : 'text-[#12141d] text-base font-bold '
            const roleClass = t.featured
              ? 'text-[#ffffffb3] text-[13px] '
              : 'text-gray-500 text-[13px] '
            return (
              <article key={t.name} className={cardClass}>
                <span className={starClass} aria-label="5 out of 5 stars">★★★★★</span>
                <blockquote className={quoteClass}>&quot;{t.quote}&quot;</blockquote>
                <footer className="flex flex-col gap-1">
                  <cite className={`${nameClass} not-italic`}>{t.name}</cite>
                  <p className={roleClass}>{t.role}</p>
                </footer>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}