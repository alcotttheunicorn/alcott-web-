'use client'

import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { forgotPassword } from '@/lib/api/auth-api'
import { toast } from '@/components/ui/use-toast'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function OTPVerificationPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [resendTimer, setResendTimer] = useState(65)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const resendMutation = useMutation({
    mutationFn: () => (email ? forgotPassword(email) : forgotPassword(undefined, phoneNumber)),
  })
  const isLoading = resendMutation.isPending

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(window.localStorage.getItem('pendingResetEmail') || '')
      setPhoneNumber(window.localStorage.getItem('pendingResetPhone') || '')
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
    if (value && index < 3) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendCode = () => {
    if (!email && !phoneNumber) {
      setErrorMessage('No contact details found for this reset request.')
      return
    }

    setErrorMessage(null)

    resendMutation.mutate(undefined, {
      onSuccess: (response) => {
        setResendTimer(65)
        setOtp(['', '', '', ''])
        inputRefs.current[0]?.focus()
        toast({ title: 'Code sent', description: response?.message || 'A new reset code was sent.' })
      },
      onError: (err: any) => {
        const apiErrorMessage =
          err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Could not resend the reset code.'
        setErrorMessage(apiErrorMessage)
        toast({ title: 'Resend failed', description: apiErrorMessage })
      },
    })
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

  const contactLabel = email
    ? `Code has been sent to ${email}`
    : phoneNumber
      ? `Code has been sent to ${phoneNumber}`
      : 'Code has been sent to your contact details'

  return (
    <AuthLayout
      illustration="/forgot_password.png"
      illustrationAlt="Forgot password illustration"
      header={{ backHref: '/forgot-password', title: 'Forgot Password' }}
    >
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          {contactLabel}
        </h2>

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
              className="w-20 h-16 text-center text-2xl font-bold border-2 border-gray-300 bg-gray-50 rounded-lg focus:border-[#4043FF] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-200"
              style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
            />
          ))}
        </div>

        {errorMessage && (
          <p className="mb-4 text-sm text-red-600 text-center lg:text-left font-bold">{errorMessage}</p>
        )}

        <div className="text-center lg:text-left">
          <button
            onClick={handleResendCode}
            disabled={resendTimer > 0 || isLoading}
            className={`text-sm font-bold ${
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
        className="w-full h-12 bg-[#4043FF] hover:bg-[#3333CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-full"
        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
      >
        Continue
      </Button>
    </AuthLayout>
  )
}