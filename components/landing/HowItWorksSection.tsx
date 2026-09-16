export function HowItWorksSection() {
    return (
        <section className="bg-[#4043FF] py-16 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500 rounded-full transform -translate-x-1/2 translate-y-1/2 opacity-20"></div>

            <div className="max-w-8xl mx-auto px-4 lg:px-12 relative z-10">
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
                    <h2 className="text-3xl font-bold text-white mb-10" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>How it Works</h2>

                    <div className="space-y-8 text-center mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Create Account</h3>
                            <p className="text-white opacity-90 text-base leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                Log on to our web app and create your account
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Book Shipment</h3>
                            <div className="space-y-1 text-white opacity-90 text-base leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                <p>1. Select &apos;request a delivery&apos; or &apos;new shipment&apos;</p>
                                <p>2. Select whether you want to drop-off at one of our hubs or you want us to pick up from your location</p>
                                <p>3. Enter details of sender and receiver</p>
                                <p>4. Declare the item type and weight</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Make Payment</h3>
                            <p className="text-white opacity-90 text-base leading-relaxed" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                                Pay and that&apos;s it! Your package is on it&apos;s way to the receiver
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <img src="/mobile-left-section.png" alt="Dashboard screenshot" className="w-full max-w-sm mx-auto" />
                    </div>
                </div>
            </div>
        </section>
    )
}
