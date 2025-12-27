
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { TestimonialsSection } from '@/components/testimonials-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  useEffect(() => {
    const mobileMenuButton = document.querySelector('button[class*="md:hidden"]');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    
    if (mobileMenuButton && mobileMenuOverlay && mobileMenuPanel) {
      mobileMenuButton.addEventListener('click', function() {
        mobileMenuOverlay.classList.remove('hidden');
        // Trigger animation after removing hidden class
        setTimeout(() => {
          mobileMenuPanel.classList.remove('translate-x-full');
        }, 10);
      });
    }
    
    if (closeMobileMenu && mobileMenuOverlay && mobileMenuPanel) {
      closeMobileMenu.addEventListener('click', function() {
        mobileMenuPanel.classList.add('translate-x-full');
        // Hide overlay after animation completes
        setTimeout(() => {
          mobileMenuOverlay.classList.add('hidden');
        }, 300);
      });
    }
    
    if (mobileMenuOverlay && mobileMenuPanel) {
      mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
          mobileMenuPanel.classList.add('translate-x-full');
          // Hide overlay after animation completes
          setTimeout(() => {
            mobileMenuOverlay.classList.add('hidden');
          }, 300);
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F9FD] flex flex-col">
      {/* Hero Section with Background */}
      <div className="bg-[#F3F9FD]">
      {/* Top Contact Bar */}
      <div className="bg-[#4043FF] text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>info@alcott.com.ng</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>+234 906 000 7571</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header className="w-full flex items-center justify-between px-4 md:px-12 py-4 md:py-6 bg-[#F3F9FD]">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/alcott-small.png"
            alt="alcott logo"
            className="h-8 w-auto md:h-12"
          />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          <a href="#" className="text-gray-700 hover:text-[#4043FF] transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Home</a>
          <a href="#" className="text-gray-700 hover:text-[#4043FF] transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Ship</a>
          <a href="#" className="text-gray-700 hover:text-[#4043FF] transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Track</a>
          <a href="#" className="text-gray-700 hover:text-[#4043FF] transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Shop & Ship</a>
        </nav>
        
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="bg-transparent border-2 border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white px-6 py-2 text-base font-semibold rounded-full font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }} onClick={() => window.location.href = '/auth/lets-get-you-in'}>
              Sign In
            </Button>
            <Button className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-6 py-2 text-base font-semibold rounded-full font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }} onClick={() => window.location.href = '/auth/lets-get-you-in'}>
              Register
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-700"></div>
              <div className="w-full h-0.5 bg-gray-700"></div>
              <div className="w-full h-0.5 bg-gray-700"></div>
            </div>
          </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 hidden transition-opacity duration-300 ease-in-out" id="mobile-menu-overlay">
        <div className="absolute right-0 top-0 h-full w-2/3 bg-white shadow-xl transform translate-x-full transition-transform duration-300 ease-in-out" id="mobile-menu-panel">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <img
                src="/alcott-small.png"
                alt="Alcott Logo"
                className="h-8 w-auto"
              />
            </div>
            <button className="text-gray-700 hover:text-gray-900" id="close-mobile-menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="p-6">
            {/* Navigation Links */}
            <nav className="space-y-4 mb-8">
              <a href="#" className="block text-lg font-medium text-gray-700 hover:text-[#4043FF] transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Home</a>
              <a href="#" className="block text-lg font-medium text-gray-700 hover:text-[#4043FF] transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Ship</a>
              <a href="#" className="block text-lg font-medium text-gray-700 hover:text-[#4043FF] transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Track</a>
              <a href="#" className="block text-lg font-medium text-gray-700 hover:text-[#4043FF] transition-colors font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Shop & Ship</a>
            </nav>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <Button variant="outline" className="w-full bg-transparent border-2 border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white py-3 text-base font-semibold rounded-full font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }} onClick={() => window.location.href = '/auth/lets-get-you-in'}>
                Sign In
              </Button>
              <Button className="w-full bg-[#4043FF] hover:bg-[#3333CC] text-white py-3 text-base font-semibold rounded-full font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }} onClick={() => window.location.href = '/auth/lets-get-you-in'}>
                Register
              </Button>
              <Button className="w-full bg-[#4043FF] hover:bg-[#3333CC] text-white py-3 text-base font-semibold rounded-full font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }} onClick={() => alert('Request a delivery functionality coming soon!')}>
                Request a delivery
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              Alcott V12 © Copyright 2023. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto w-full px-4 lg:px-12 py-8">
        {/* Left: Hero Text - Desktop Layout */}
        <section className="hidden lg:flex flex-1 flex-col items-start justify-center max-w-2xl lg:pr-12">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            <span className="text-[#4043FF] font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Ship</span> and receive{' '}
            <span className="text-black font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>packages</span> to and{' '}
            from any location{' '}
            <span className="text-[#4043FF] font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>worldwide</span> from your{' '}
            convenience
            </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            Request for a delivery and a courier will have it picked up from your doorstep and deliver to your customer's doorstep anywhere around the globe.
          </p>
          
          {/* Pill-shaped Tracking Input */}
          <div className="flex w-full max-w-lg mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Enter tracking number"
                className="w-full h-12 bg-white border-2 border-gray-200 px-6 text-base text-gray-900 placeholder:text-gray-500 rounded-l-full rounded-r-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent border-r-0"
              />
            </div>
            <Button className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-8 py-3 text-base font-semibold rounded-r-full rounded-l-none h-12 border-2 border-[#4043FF] border-l-0" onClick={() => alert('Track functionality coming soon!')}>
              Track
            </Button>
          </div>
          
          <Button className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-8 py-3 text-base font-semibold rounded-full w-full max-w-lg h-12 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }} onClick={() => alert('Request a delivery functionality coming soon!')}>
            Request a delivery
          </Button>
        </section>

        {/* Mobile Hero Section */}
        <section className="lg:hidden px-4 py-8 text-center w-full">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-6 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            <span className="text-[#4043FF] font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Ship</span> and receive<br />
            <span className="text-black font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>packages</span> to and<br />
            from any<br />
            location<br />
            <span className="text-[#4043FF] font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>worldwide</span> from<br />
            your<br />
            convenience
          </h1>
          
          <p className="text-base text-gray-600 mb-8 text-left max-w-sm mx-auto font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            Request for a delivery and a courier will have it picked up from your doorstep and deliver to your customer's doorstep anywhere around the globe.
          </p>
          
          {/* Pill-shaped Tracking Input */}
          <div className="flex w-full max-w-sm mx-auto mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Enter tracking number"
                className="w-full h-12 bg-white border-2 border-gray-200 px-4 text-base text-gray-900 placeholder:text-gray-500 rounded-l-full rounded-r-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent border-r-0"
              />
            </div>
            <Button className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-6 py-3 text-base font-semibold rounded-r-full rounded-l-none h-12 border-2 border-[#4043FF] border-l-0" onClick={() => alert('Track functionality coming soon!')}>
              Track
            </Button>
          </div>
          
          <Button className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-6 py-3 text-base font-semibold rounded-full w-full max-w-sm h-12 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }} onClick={() => alert('Request a delivery functionality coming soon!')}>
            Request a delivery
          </Button>
        </section>

        {/* Right: Phone Mockup - Desktop Layout */}
        <section className="hidden lg:flex flex-1 flex-col items-center justify-center relative w-full h-[600px]">
          {/* Mobile Landing Image */}
          <img
            src="/mobile-landing-hero.png"
            alt="Mobile app mockup"
            className="w-[400px] h-auto transform rotate-12 mb-8"
          />
          
          {/* Download App Section */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              Download our mobile app
              <svg className="w-6 h-6 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
              </svg>
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-xs font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              Download our mobile app and enjoy seamless shipping
            </p>
            <div className="flex space-x-4">
              <div className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 cursor-pointer transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="font-medium font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>App Store</span>
              </div>
              <div className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 cursor-pointer transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span className="font-medium font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Google Play</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Phone Mockup Section */}
        <section className="lg:hidden flex-1 flex flex-col items-center justify-center relative w-full px-4 space-y-8">
          {/* Mobile Landing Image */}
          <img
            src="/mobile-landing-hero.png"
            alt="Mobile app mockup"
            className="w-[300px] h-auto"
          />
          
          {/* Download App Section - Mobile */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              Download our mobile app
              <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
              </svg>
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-xs font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              Download our mobile app and enjoy seamless shipping
            </p>
            <div className="flex space-x-4">
              <div className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer transition-colors duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="font-medium text-sm font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>App Store</span>
              </div>
              <div className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer transition-colors duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span className="font-medium text-sm font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Google Play</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

      {/* New Section - Product Showcase with Check Rates */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left: Product Image Section */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-6 lg:mb-8">
                {/* Main Product Image */}
                <img
                  src="/check-rates.png"
                  alt="Product packaging"
                  className="w-full max-w-sm lg:max-w-lg rounded-2xl mx-auto"
                />
                
                
              </div>
            </div>

            {/* Right: Check Rates Form */}
            <div className="flex-1 w-full max-w-md mx-auto lg:mx-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Check Rates</h2>
              
              <div className="space-y-4">
                {/* Pick up address */}
                <div className="relative">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-6 h-6 bg-[#4043FF] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Pick up address"
                      className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium font-[Urbanist]"
                      style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                    />
                    <div className="w-6 h-6 bg-[#4043FF] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Delivery address */}
                <div className="relative">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-6 h-6 bg-[#4043FF] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Delivery address"
                      className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium font-[Urbanist]"
                      style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                    />
                    <div className="w-6 h-6 bg-[#4043FF] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Weight */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Weight</h3>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-6 h-6 bg-[#4043FF] rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v6l5.25 3.15.75-1.23-4.5-2.67V8z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="2.2"
                      className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium font-[Urbanist]"
                      style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                    />
                    <span className="text-gray-500 font-medium font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>kg</span>
                  </div>
                </div>
                
                {/* Phone number */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Phone number</h3>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-6 h-6 bg-[#4043FF] rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      placeholder="+234 906 000 7571"
                      className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium font-[Urbanist]"
                      style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Email</h3>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-6 h-6 bg-[#4043FF] rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="info@alcott.com.ng"
                      className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium font-[Urbanist]"
                      style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                    />
                  </div>
                </div>
                
                {/* Check Button */}
                <Button className="bg-[#4043FF] hover:bg-[#3333CC] text-white px-8 py-3 text-base font-semibold rounded-full w-full h-12 mt-6" onClick={() => alert('Check rates functionality coming soon!')}>
                  Check
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Our Services</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Local & Interstate Deliveries */}
            <div className="bg-white p-8 text-left">
              <div className="w-20 h-20 bg-[#E0E0FF] rounded-2xl flex items-center justify-center mb-6">
                <img
                  src="/icons/truck-icon.png"
                  alt="Truck delivery icon"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Local & Interstate Deliveries</h3>
              <p className="text-gray-600 text-lg leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Fast, reliable deliveries across every state in Nigeria. From instant same-day drop-offs to scheduled interstate shipping, Alcott gets your packages where they need to be — safely and on time.</p>
            </div>

            {/* Package Delivery */}
            <div className="bg-white p-8 text-left">
              <div className="w-20 h-20 bg-[#E0E0FF] rounded-2xl flex items-center justify-center mb-6">
                <img
                  src="/icons/box-icon.png"
                  alt="Package delivery icon"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Package Delivery</h3>
              <p className="text-gray-600 text-lg leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Ship goods in and out of Nigeria without stress. We handle pickup, international movement, and last-mile delivery straight to your doorstep, ensuring a seamless end-to-end experience.</p>
            </div>

            {/* Import Deliveries */}
            <div className="bg-white p-8 text-left">
              <div className="w-20 h-20 bg-[#E0E0FF] rounded-2xl flex items-center justify-center mb-6">
                <img
                  src="/icons/import-icon.png"
                  alt="Import delivery icon"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Import Deliveries</h3>
              <p className="text-gray-600 text-lg leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Moving large cargo or complex shipments? Alcott manages air and sea freight worldwide, including customs documentation and clearance. We make global trade smooth, compliant, and hassle-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Alcott Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
              Why Use Alcott?
            </h2>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-start gap-16">
            {/* Left: Features List */}
            <div className="flex-1 space-y-8">
              {/* Easy to use */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#E0E0FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Easy to use</h3>
                  <p className="text-gray-600 leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Navigate through the Alcott app easily as individuals or businesses, book shipment & deliveries alongside many more things.
                  </p>
                </div>
              </div>

              {/* Super fast */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#E0E0FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Super fast</h3>
                  <p className="text-gray-600 leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Across our platforms all logistics processes are blazing fast because of our efficient partners and digital servers that anchors our work.
                  </p>
                </div>
              </div>

              {/* Safe & secure */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#E0E0FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Safe & secure</h3>
                  <p className="text-gray-600 leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Your shipments and payments are protected at every stage. With secure systems, trusted partners, and real-time tracking, we guarantee peace of mind from dispatch to delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Dashboard Screenshot */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                {/* Dashboard Image without frame */}
                <img
                  src="/right-section-3.png"
                  alt="Dashboard screenshot"
                  className="w-full h-auto max-w-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-[#4043FF] py-16 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500 rounded-full transform -translate-x-1/2 translate-y-1/2 opacity-20"></div>
        
        <div className="max-w-6xl mx-auto px-4 lg:px-12 relative z-10">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-end gap-8">
            {/* Left: Mobile App Mockup */}
            <div className="flex-1 flex justify-center">
              <div className="relative -mb-16">
                <img
                  src="/mobile-left-section.png"
                  alt="Mobile tracking app"
                  className="w-[900px] h-auto "
                />
              </div>
            </div>

            {/* Right: How it Works Content */}
            <div className="flex-1 text-white max-w-md">
              <h2 className="text-3xl font-semibold mb-8 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>How it Works</h2>
              
              <div className="space-y-6">
                {/* Create Account */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Create Account</h3>
                  <p className="text-base opacity-90 leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Log on to our web app and create your account
                  </p>
                </div>

                {/* Book Shipment */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Book Shipment</h3>
                  <div className="space-y-1 text-base opacity-90 leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    <p>1. Select 'request a delivery' or 'new shipment'</p>
                    <p>2. Select whether you want to drop-off at one of our hubs or you want us to pick up from your location</p>
                    <p>3. Enter details of sender and receiver</p>
                    <p>4. Declare the item type and weight</p>
                  </div>
                </div>

                {/* Make Payment */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>Make Payment</h3>
                  <p className="text-base opacity-90 leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                    Pay and that's it! Your package is on it's way to the receiver
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden text-center">
            <h2 className="text-3xl font-bold text-white mb-8 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>How it Works</h2>
            
            {/* Mobile Header Text */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Running a <span className="text-[#FFD700]">business</span> has so many moving parts, lets make your logistics more efficient.
              </h3>
              <p className="text-white opacity-90 text-sm leading-relaxed font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Whether you are an individual, farmer, FMCG or manufacturing company, Alcott will complement your supply chain process by providing movement and storage of your goods as well as providing valuable insights on tracking.
              </p>
            </div>

            {/* Mobile mockup  Screenshot - Mobile */}
            <div className="mb-8 flex justify-center">
              <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-sm">
                <img
                  src="/mobile-left-section.png"
                  alt="Dashboard screenshot"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Feature Cards - Mobile */}
            <div className="space-y-6">
              {/* Easy to use */}
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

              {/* Super fast */}
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

              {/* Safe & secure */}
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

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Got questions? We have answers for you
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our shipping, pricing and platform.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-gray-700 hover:text-[#4043FF] transition-colors">
                How do I get a quote for shipping?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                You can get a shipping quote by using our "Check Rates" form on the homepage. Simply enter your pickup and delivery addresses, package weight, and we'll provide you with an instant quote. You can also contact our customer service team for personalized quotes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-gray-700 hover:text-[#4043FF] transition-colors">
                How long does the shipping take?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Shipping times vary depending on the destination and service type. Local deliveries within Lagos typically take 1-2 days, interstate deliveries take 2-5 days, and international shipments can take 5-14 days. You'll receive an estimated delivery time when you book your shipment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-gray-700 hover:text-[#4043FF] transition-colors">
                Where can i ship foodstuff to?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                We ship foodstuff to most locations within Nigeria and select international destinations. However, some countries have restrictions on certain food items. Please check our food shipping guidelines or contact our team to confirm if your specific food items can be shipped to your desired destination.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-gray-700 hover:text-[#4043FF] transition-colors">
                What food stuff can I not ship?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                We cannot ship perishable items that require refrigeration, liquids in glass containers, alcohol, tobacco products, or any items that violate international shipping regulations. For a complete list of restricted items, please refer to our shipping guidelines or contact our customer service team.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-gray-700 hover:text-[#4043FF] transition-colors">
                What is the price of cargo shipping?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Cargo shipping prices are calculated based on weight, dimensions, destination, and service type. Our pricing is competitive and transparent. Use our online quote calculator for instant pricing, or contact our sales team for bulk shipping rates and custom solutions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-gray-700 hover:text-[#4043FF] transition-colors">
                How much is the custom duties charge?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Custom duties are determined by the destination country's customs regulations and are not included in our shipping fees. Duties are typically calculated as a percentage of the declared value of your package. We can provide estimates, but final duty charges are determined by customs authorities at the destination.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-gray-700 hover:text-[#4043FF] transition-colors">
                How can I use the web app?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Our web app is easy to use! Simply create an account, log in, and you can book shipments, track packages, manage your profile, and access all our services. The interface is intuitive and mobile-friendly, so you can manage your shipments from anywhere, anytime.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

    </div>
  )
}

