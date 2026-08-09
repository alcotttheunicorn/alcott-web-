import { TestimonialCard } from './testimonial-card'

const testimonials = [
  {
    name: "Sola Osinioki",
    title: "Senior Business Executive",
    company: "Microsoft",
    quote: "Alcott is very efficient, sent a package from London, UK to a suburb in Makurdi, Nigeria. the process was smooth and the recipient got the package in good condition",
    avatar: "/testimonial-1.png"
  },
  {
    name: "Eddie Osarenkhoe",
    title: "M.D ",
    company: "Serock Energy Services Limited.",
    quote: "Alcott exceeded our expectations. They seamlessly picked up our oil and gas drilling equipment from aberdeen, handled all customs procedures, and delivered it to Lagos - all within just 5 days. Their efficiency and professionalism have truly set a new standard in logistics.",
    avatar: "/testimonial-2.png"
  },
  {
    name: "Joseph Ojike",
    title: "C.E.O ",
    company: "Forwarding Orthopaedics",
    quote: "Our shipment of medical implants from Italy and France are always delivered on time, typically within 7 days. Alcott's reliable serviceand attention to detailgive us the confidence to focuson our core mission of delivering quality healthcare.",
    avatar: "/testimonial-3.png"
  }
]

export function TestimonialsSection() {
  return (
    <section className="bg-[#F8F9FA] py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            Don't just take our word for it,
          </h2>
          <p className="text-2xl font-bold text-[#4043FF] font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            See for yourself.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              title={testimonial.title}
              company={testimonial.company}
              quote={testimonial.quote}
              avatar={testimonial.avatar}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            Get started with Alcott.
          </h3>
          <button className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-12 py-4 text-lg font-semibold rounded-full transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            Register
          </button>
        </div>
      </div>
    </section>
  )
}
