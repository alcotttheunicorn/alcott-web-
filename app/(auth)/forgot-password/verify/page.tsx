'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { forgotPassword } from '@/lib/api/auth-api'
import { toast } from '@/components/ui/use-toast'

export default function OTPVerificationPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [resendTimer, setResendTimer] = useState(65)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingEmail = window.localStorage.getItem('pendingResetEmail') || ''
      const pendingPhone = window.localStorage.getItem('pendingResetPhone') || ''
      setEmail(pendingEmail)
      setPhoneNumber(pendingPhone)
    }
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((current) => current - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendCode = async () => {
    if (!email && !phoneNumber) {
      setErrorMessage('No contact details found for this reset request.')
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage(null)
      const response = email
        ? await forgotPassword(email)
        : await forgotPassword(undefined, phoneNumber)

      setResendTimer(65)
      setOtp(['', '', '', ''])
      inputRefs.current[0]?.focus()
      toast({ title: 'Code sent', description: response?.message || 'A new reset code was sent.' })
    } catch (err: any) {
      const apiErrorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Could not resend the reset code.'
      setErrorMessage(apiErrorMessage)
      toast({ title: 'Resend failed', description: apiErrorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 4) {
      setErrorMessage('Please enter the 4-digit reset code.')
      return
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('pendingResetOtp', otpCode)
      if (email) window.localStorage.setItem('pendingResetEmail', email)
      if (phoneNumber) window.localStorage.setItem('pendingResetPhone', phoneNumber)
    }

    router.push('/forgot-password/new-password')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
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

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-lg">
            <img src="/forgot_password.png" alt="Forgot password illustration" className="w-full h-auto" />
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                {email
                  ? `Code has been sent to ${email}`
                  : phoneNumber
                    ? `Code has been sent to ${phoneNumber}`
                    : 'Code has been sent to your contact details'}
              </h2>
            </div>

            <div className="mb-8">
              <div className="flex justify-center lg:justify-start space-x-4 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                   ref={(el) => { inputRefs.current[index] = el }}
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

              {errorMessage && (
                <p className="mb-4 text-sm text-red-600 text-center lg:text-left font-[Urbanist] font-bold">{errorMessage}</p>
              )}

              <div className="text-center lg:text-left">
                <button
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || isLoading}
                  className={`text-sm font-bold font-[Urbanist] ${
                    resendTimer > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[#4043FF] hover:text-[#3333CC] cursor-pointer'
                  }`}
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer} s` : 'Resend code'}
                </button>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={otp.join('').length !== 4 || isLoading}
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
