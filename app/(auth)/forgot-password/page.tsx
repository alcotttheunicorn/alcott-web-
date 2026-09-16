'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { forgotPassword } from '@/lib/api/auth-api'
import { toast } from '@/components/ui/use-toast'

export default function ForgotPasswordPage() {
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | null>(null)
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleMethodSelect = (method: 'sms' | 'email') => {
    setSelectedMethod(method)
  }

  const handleContinue = async () => {
    if (!selectedMethod) return

    // Validate input based on selected method
    if (selectedMethod === 'email' && !email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
      })
      return
    }

    if (selectedMethod === 'sms' && !phoneNumber.trim()) {
      toast({
        title: 'Phone number required',
        description: 'Please enter your phone number.',
      })
      return
    }

    setIsLoading(true)
    try {
      await forgotPassword(
        selectedMethod === 'email' ? email.trim() : undefined,
        selectedMethod === 'sms' ? phoneNumber.trim() : undefined
      )

      // Store the contact info for the next step
      if (typeof window !== 'undefined') {
        if (selectedMethod === 'email') {
          localStorage.setItem('pendingResetEmail', email.trim())
        } else {
          localStorage.setItem('pendingResetPhone', phoneNumber.trim())
        }
      }

      toast({
        title: 'Reset code sent',
        description: `A reset code has been sent to your ${selectedMethod === 'email' ? 'email' : 'phone'}.`,
      })

      // Navigate to OTP verification page
      router.push('/forgot-password/verify')
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to send reset code. Please try again.'
      toast({
        title: 'Failed to send code',
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <Link href="/sign-in" className="mr-4">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          Forgot Password
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Illustration */}
        <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-lg">
            <img
              src="/forgot_password.png"
              alt="Forgot password illustration"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right Side - Selection Options */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header Text */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Select which contact details we should use to reset your password
              </h2>
            </div>

            {/* Contact Method Cards */}
            <div className="space-y-4 mb-8">
              {/* SMS Option */}
              <div
                onClick={() => handleMethodSelect('sms')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedMethod === 'sms'
                    ? 'border-[#4043FF] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4 mb-3">
                  {/* SMS Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                          via SMS
                        </p>
                        <p className="text-base font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                          via SMS
                        </p>
                      </div>
                      
                      {/* Radio Button Indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === 'sms'
                          ? 'border-[#4043FF] bg-[#4043FF]'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {selectedMethod === 'sms' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phone Input - shown when SMS is selected */}
                {selectedMethod === 'sms' && (
                  <div className="mt-3">
                    <Input
                      type="tel"
                      placeholder="Enter phone number (e.g., +234 812 345 6789)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Email Option */}
              <div
                onClick={() => handleMethodSelect('email')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedMethod === 'email'
                    ? 'border-[#4043FF] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4 mb-3">
                  {/* Email Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                          via Email
                        </p>
                        <p className="text-base font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                          via Email
                        </p>
                      </div>
                      
                      {/* Radio Button Indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === 'email'
                          ? 'border-[#4043FF] bg-[#4043FF]'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {selectedMethod === 'email' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Input - shown when Email is selected */}
                {selectedMethod === 'email' && (
                  <div className="mt-3">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!selectedMethod || isLoading}
              className="w-full h-12 bg-[#4043FF] hover:bg-[#3333CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-full font-[Urbanist]"
              style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
            >
              {isLoading ? 'Sending...' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
