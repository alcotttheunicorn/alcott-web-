'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [resendTimer, setResendTimer] = useState(65)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendCode = () => {
    console.log('Resending code...')
    setResendTimer(65)
    setOtp(['', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  const handleContinue = () => {
    const otpCode = otp.join('')
    if (otpCode.length === 4) {
      // Verify OTP and proceed to create new password
      console.log('OTP:', otpCode)
      window.location.href = '/forgot-password/new-password'
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <Link href="/forgot-password" className="mr-4">
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

        {/* Right Side - OTP Input */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header Text */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Code has been send to +1 111 ••••••99
              </h2>
            </div>

            {/* OTP Input */}
            <div className="mb-8">
              <div className="flex justify-center lg:justify-start space-x-4 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-20 h-16 text-center text-2xl font-bold border-2 border-gray-300 bg-gray-50 rounded-lg focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-200 font-[Urbanist]"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                  />
                ))}
              </div>

              {/* Resend Code */}
              <div className="text-center lg:text-left">
                <button
                  onClick={handleResendCode}
                  disabled={resendTimer > 0}
                  className={`text-sm font-bold font-[Urbanist] ${
                    resendTimer > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[#4043FF] hover:text-[#3333CC] cursor-pointer'
                  }`}
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer} s`
                    : 'Resend code'
                  }
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={otp.join('').length !== 4}
              className="w-full h-12 bg-[#4043FF] hover:bg-[#3333CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-full font-[Urbanist]"
              style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
