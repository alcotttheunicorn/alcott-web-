export function HowItWorksSection() {
    return (
        <section className="bg-[#4043FF] py-16 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500 rounded-full transform -translate-x-1/2 translate-y-1/2 opacity-20"></div>

            <div className="max-w-6xl mx-auto px-4 lg:px-12 relative z-10">
                <div className="hidden lg:flex items-end gap-8">
                    <div className="flex-1 flex justify-center">
                        <div className="relative -mb-16">
                            <img src="/mobile-left-section.png" alt="Mobile tracking app" className="w-[900px] h-auto" />
                        </div>
                    </div>

                    <div className="flex-1 text-white max-w-md">
                        <h2 className="text-3xl font-semibold mb-8" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>How it Works</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Create Account</h3>
                                <p className="text-base opacity-90 leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                    Log on to our web app and create your account
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Book Shipment</h3>
                                <div className="space-y-1 text-base opacity-90 leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                    <p>1. Select &apos;request a delivery&apos; or &apos;new shipment&apos;</p>
                                    <p>2. Select whether you want to drop-off at one of our hubs or you want us to pick up from your location</p>
                                    <p>3. Enter details of sender and receiver</p>
                                    <p>4. Declare the item type and weight</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Make Payment</h3>
                                <p className="text-base opacity-90 leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                    Pay and that&apos;s it! Your package is on it&apos;s way to the receiver
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:hidden text-center">
                    <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>How it Works</h2>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                            Running a <span className="text-[#FFD700]">business</span> has so many moving parts, lets make your logistics more efficient.
                        </h3>
                        <p className="text-white opacity-90 text-sm leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                            Whether you are an individual, farmer, FMCG or manufacturing company, Alcott will complement your supply chain process by providing movement and storage of your goods as well as providing valuable insights on tracking.
                        </p>
                    </div>

                    <div className="mb-8 flex justify-center">
                        <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-sm">
                            <img src="/mobile-left-section.png" alt="Dashboard screenshot" className="w-full h-auto rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#E0E0FF] rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Easy to use</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Navigate through the haul247 app easily as a client or partner to book warehouses & trucks alongside many more things.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#E0E0FF] rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Super fast</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Across our platforms all logistics processes are blazing fast because of our efficient partners and digital servers that anchors our work.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#E0E0FF] rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & secure</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Many desktop publishing packages and web page editors now use for them.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
