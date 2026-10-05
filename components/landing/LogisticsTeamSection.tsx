export function LogisticsTeamSection() {
  return (
    <section
      aria-labelledby="logistics-team-heading"
      className="w-full bg-white py-14 lg:py-20
    ">
      <div className="max-w-9xl mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.28fr] rounded-3xl overflow-hidden">
          <div className="flex flex-col items-start gap-4 px-6 sm:px-10 lg:px-16 py-12 lg:py-16 bg-[#eaf2ff]">
            <div className="text-[#4043ff] text-[11px] font-bold tracking-[0.88px] font-[Plus_Jakarta_Sans',system-ui,sans-serif]">
              FOR BUSINESSES
            </div>
            <h2
              id="logistics-team-heading"
              className="text-[#0d1124] text-[28px] sm:text-[34px] font-bold tracking-[-0.68px] leading-[1.15] font-[Plus_Jakarta_Sans',system-ui,sans-serif]"
            >
              Your logistics team,
              <br />
              without the overhead.
            </h2>
            <p className="text-[#5b6070] text-sm leading-[1.55] font-[Plus_Jakarta_Sans',system-ui,sans-serif]">
              We support businesses, manufacturers, retailers and corporate
              clients with end-to-end logistics, from first mile to final
              delivery, our specialists keep every shipment moving.
            </p>
            <div className="flex items-center gap-3 pt-4 flex-wrap">
              <a
                href="mailto:info@alcott.com.ng"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#4043ff] rounded-3xl hover:bg-[#3333cc] transition-colors
              ">
                <span className="text-white text-[13px] font-semibold font-[Plus_Jakarta_Sans',system-ui,sans-serif]">
                  Talk to our team
                </span>
              </a>
              <a
                href="/services"
                className="text-[#4043ff] text-[13px] font-semibold font-[Plus_Jakarta_Sans',system-ui,sans-serif] hover:underline"
              >
                Learn more →
              </a>
            </div>
          </div>
          <div
            role="img"
            aria-label="Freight containers being loaded at a logistics facility"
            className="relative min-h-[260px] lg:min-h-[704px] bg-[url(/freight-image-2.png)] bg-cover bg-center"
          />
        </div>
      </div>
    </section>
  )
}