export function GlobalShoppingSection() {
  return (
    <section
      aria-labelledby="global-shopping-heading"
      className="w-full bg-white py-14 lg:py-20
    ">
      <div className="max-w-9xl mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden">
          <div className="flex flex-col items-start gap-4 px-6 sm:px-10 lg:px-16 py-12 lg:py-16 bg-[#f5f8ff]">
            <div className="text-[#123cff] text-[11px] font-bold tracking-[0.88px] font-[Plus_Jakarta_Sans',system-ui,sans-serif]">
              SHOP &amp; SHIP
            </div>
            <h2
              id="global-shopping-heading"
              className="text-[#0d1124] text-[28px] sm:text-[36px] lg:text-[40px] font-bold tracking-[-0.8px] leading-[1.15] font-[Plus_Jakarta_Sans',system-ui,sans-serif]"
            >
              Buy globally.
              <br />
              We&apos;ll bring it home.
            </h2>
            <p className="text-[#5b6070] text-base leading-6 font-[Plus_Jakarta_Sans',system-ui,sans-serif]">
              Shop from international stores and suppliers, ship to your Alcott
              address and we&apos;ll handle the rest — consolidation, shipping,
              customs and delivery to your doorstep.
            </p>
            <a
              href="/#shop-and-ship"
              className="inline-flex items-center justify-center px-6 h-[58px] bg-[#123cff] rounded-[29px] shadow-[0px_4px_4px_#00000040] hover:bg-[#0d2ecc] transition-colors"
              aria-label="Learn about Shop and Ship"
            >
              <span className="text-white text-sm font-semibold font-[Inter',system-ui,sans-serif]">
                Learn about Shop &amp; Ship →
              </span>
            </a>
          </div>
          <div
            aria-label="Shop and Ship lifestyle"
            role="img"
            className="relative min-h-[280px] lg:min-h-[583px] bg-[url(/shopping-parcel-scene.png)] bg-cover bg-center"
          />
        </div>
      </div>
    </section>
  )
}