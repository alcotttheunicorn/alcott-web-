export function WhyUseAlcottSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                        Why Use Alcott?
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-16">
                    <div className="flex-1 space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#E0E0FF] rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Easy to use</h3>
                                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                    Navigate through the Alcott app easily as individuals or businesses, book shipment & deliveries alongside many more things.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#E0E0FF] rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Super fast</h3>
                                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                    Across our platforms all logistics processes are blazing fast because of our efficient partners and digital servers that anchors our work.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#E0E0FF] rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Safe & secure</h3>
                                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                    Your shipments and payments are protected at every stage. With secure systems, trusted partners, and real-time tracking, we guarantee peace of mind from dispatch to delivery.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="relative">
                            <img src="/right-section-3.png" alt="Dashboard screenshot" className="w-full h-auto max-w-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
