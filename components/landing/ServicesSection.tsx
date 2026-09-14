export function ServicesSection() {
    return (
        <section className="bg-white py-20">
            <div className="max-w-8xl mx-auto px-4 lg:px-12 text-center">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Our Services</h2>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="bg-white p-8 text-left">
                        <div className="w-20 h-20 bg-[#E0E0FF] rounded-2xl flex items-center justify-center mb-6">
                            <img src="/icons/truck-icon.png" alt="Truck delivery icon" className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Local & Interstate Deliveries</h3>
                        <p className="text-gray-600 text-lg leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Fast, reliable deliveries across every state in Nigeria. From instant same-day drop-offs to scheduled interstate shipping, Alcott gets your packages where they need to be — safely and on time.</p>
                    </div>

                    <div className="bg-white p-8 text-left">
                        <div className="w-20 h-20 bg-[#E0E0FF] rounded-2xl flex items-center justify-center mb-6">
                            <img src="/icons/box-icon.png" alt="Package delivery icon" className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Package Delivery</h3>
                        <p className="text-gray-600 text-lg leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Ship goods in and out of Nigeria without stress. We handle pickup, international movement, and last-mile delivery straight to your doorstep, ensuring a seamless end-to-end experience.</p>
                    </div>

                    <div className="bg-white p-8 text-left">
                        <div className="w-20 h-20 bg-[#E0E0FF] rounded-2xl flex items-center justify-center mb-6">
                            <img src="/icons/import-icon.png" alt="Import delivery icon" className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Import Deliveries</h3>
                        <p className="text-gray-600 text-lg leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Moving large cargo or complex shipments? Alcott manages air and sea freight worldwide, including customs documentation and clearance. We make global trade smooth, compliant, and hassle-free.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
