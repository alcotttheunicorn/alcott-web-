export function WhyUseAlcottSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-8xl mx-auto px-4 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                        Why Use Alcott?
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-16">
                    <div className="flex-1 space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#E0E0FF] rounded-full flex items-center justify-center shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.4" d="M14.9963 22.75C14.7263 22.75 14.4763 22.6 14.3463 22.37C14.2163 22.14 14.2163 21.85 14.3563 21.62L15.4063 19.87C15.6163 19.51 16.0763 19.4 16.4363 19.61C16.7963 19.82 16.9063 20.28 16.6963 20.64L16.4263 21.09C19.1863 20.44 21.2563 17.96 21.2563 15C21.2563 14.59 21.5963 14.25 22.0063 14.25C22.4163 14.25 22.7563 14.59 22.7563 15C22.7463 19.27 19.2663 22.75 14.9963 22.75Z" fill="#4043FF"/>
                                    <path opacity="0.4" d="M2 9.75C1.59 9.75 1.25 9.41 1.25 9C1.25 4.73 4.73 1.25 9 1.25C9.27 1.25 9.51999 1.4 9.64999 1.63C9.77999 1.86 9.78 2.15 9.64 2.38L8.59 4.13C8.38 4.49001 7.92 4.60001 7.56 4.39001C7.2 4.18001 7.09 3.71999 7.3 3.35999L7.57001 2.90997C4.81001 3.55997 2.74001 6.04 2.74001 9C2.75001 9.41 2.41 9.75 2 9.75Z" fill="#4043FF"/>
                                    <path d="M10.6709 13.8499L7.53093 12.1599C7.20093 11.9799 6.80093 11.9799 6.47093 12.1599L3.33093 13.8499C3.10093 13.9699 2.96094 14.2199 2.96094 14.4899C2.96094 14.7599 3.10093 15.0099 3.33093 15.1299L6.47093 16.8199C6.64093 16.9099 6.82093 16.9499 7.00093 16.9499C7.18093 16.9499 7.36093 16.9099 7.53093 16.8199L10.6709 15.1299C10.9009 15.0099 11.0409 14.7599 11.0409 14.4899C11.0409 14.2199 10.8909 13.9799 10.6709 13.8499Z" fill="#4043FF"/>
                                    <path d="M5.95218 17.4101L3.03218 15.9502C2.81218 15.8402 2.55218 15.8501 2.33218 15.9801C2.12218 16.1101 1.99219 16.3402 1.99219 16.5902V19.3501C1.99219 19.8301 2.25217 20.2601 2.68217 20.4701L5.60219 21.9301C5.70219 21.9801 5.81218 22.0101 5.92218 22.0101C6.05218 22.0101 6.18219 21.9702 6.30219 21.9002C6.51219 21.7702 6.64218 21.5401 6.64218 21.2901V18.5302C6.65218 18.0502 6.38218 17.6201 5.95218 17.4101Z" fill="#4043FF"/>
                                    <path d="M11.6616 15.9801C11.4516 15.8501 11.1916 15.8402 10.9616 15.9502L8.04155 17.4101C7.61155 17.6201 7.35156 18.0502 7.35156 18.5302V21.2901C7.35156 21.5401 7.48156 21.7702 7.69156 21.9002C7.81156 21.9702 7.94156 22.0101 8.07156 22.0101C8.18156 22.0101 8.29156 21.9801 8.39156 21.9301L11.3116 20.4701C11.7416 20.2601 12.0016 19.8301 12.0016 19.3501V16.5902C12.0016 16.3402 11.8716 16.1101 11.6616 15.9801Z" fill="#4043FF"/>
                                    <path d="M20.6709 3.82989L17.5309 2.13988C17.2009 1.95988 16.8009 1.95988 16.4709 2.13988L13.3309 3.82989C13.1009 3.94989 12.9609 4.19984 12.9609 4.46984C12.9609 4.73984 13.1009 4.98985 13.3309 5.10985L16.4709 6.79986C16.6409 6.88986 16.8209 6.92986 17.0009 6.92986C17.1809 6.92986 17.3609 6.88986 17.5309 6.79986L20.6709 5.10985C20.9009 4.98985 21.0409 4.73984 21.0409 4.46984C21.0409 4.18984 20.8909 3.94989 20.6709 3.82989Z" fill="#4043FF"/>
                                    <path d="M15.9522 7.37987L13.0322 5.91985C12.8122 5.80985 12.5522 5.81988 12.3322 5.94988C12.1222 6.07988 11.9922 6.30987 11.9922 6.55987V9.31987C11.9922 9.79987 12.2522 10.2299 12.6822 10.4399L15.6022 11.8999C15.7022 11.9499 15.8122 11.9798 15.9222 11.9798C16.0522 11.9798 16.1822 11.9399 16.3022 11.8699C16.5122 11.7399 16.6422 11.5099 16.6422 11.2599V8.49987C16.6522 8.01987 16.3822 7.58987 15.9522 7.37987Z" fill="#4043FF"/>
                                    <path d="M21.6616 5.94988C21.4516 5.81988 21.1916 5.80985 20.9616 5.91985L18.0415 7.37987C17.6115 7.58987 17.3516 8.01987 17.3516 8.49987V11.2599C17.3516 11.5099 17.4816 11.7399 17.6916 11.8699C17.8116 11.9399 17.9416 11.9798 18.0716 11.9798C18.1816 11.9798 18.2916 11.9499 18.3916 11.8999L21.3116 10.4399C21.7416 10.2299 22.0016 9.79987 22.0016 9.31987V6.55987C22.0016 6.30987 21.8716 6.07988 21.6616 5.94988Z" fill="#4043FF"/>
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.0025 3.66992V20.3299L11.2025 21.2399C10.0925 22.4999 9.18245 22.1599 9.18245 20.4799V13.2799H6.09245C4.69245 13.2799 4.30245 12.4199 5.23245 11.3699L12.0025 3.66992Z" fill="#4043FF"/>
                                    <path opacity="0.4" d="M18.77 12.6299L12 20.3299V3.6699L12.8 2.7599C13.91 1.4999 14.82 1.8399 14.82 3.5199V10.7199H17.91C19.31 10.7199 19.7 11.5799 18.77 12.6299Z" fill="#4043FF"/>
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.4" d="M20.9138 11.1198C20.9138 16.0098 17.3638 20.5898 12.5138 21.9298C12.1838 22.0198 11.8237 22.0198 11.4937 21.9298C6.64374 20.5898 3.09375 16.0098 3.09375 11.1198V6.72982C3.09375 5.90982 3.71376 4.97982 4.48376 4.66982L10.0537 2.38982C11.3037 1.87982 12.7137 1.87982 13.9637 2.38982L19.5338 4.66982C20.2938 4.97982 20.9238 5.90982 20.9238 6.72982L20.9138 11.1198Z" fill="#4043FF"/>
                                    <path d="M14.5 10.5C14.5 9.12 13.38 8 12 8C10.62 8 9.5 9.12 9.5 10.5C9.5 11.62 10.24 12.55 11.25 12.87V15.5C11.25 15.91 11.59 16.25 12 16.25C12.41 16.25 12.75 15.91 12.75 15.5V12.87C13.76 12.55 14.5 11.62 14.5 10.5Z" fill="#4043FF"/>
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
