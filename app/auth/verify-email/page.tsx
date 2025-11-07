'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [otpFocused, setOtpFocused] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pending = localStorage.getItem('pendingSignupEmail')
      if (pending) setEmail(pending)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Logo */}
      <div className="absolute top-6 left-6 lg:top-8 lg:left-8 z-10">
        <img
          src="/alcott-small.png"
          alt="Alcott Logo"
          className="h-8 lg:h-10 w-auto"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 font-['Urbanist']">Verify your email</h1>
            <p className="mt-2 text-gray-600 font-['Urbanist'] font-bold">Enter the code we sent to your email to continue.</p>
          </div>

          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault()
              setErrorMessage(null)
              setSuccessMessage(null)
              setIsLoading(true)
              try {
                const res = await apiClient.post('/auth/verify-email', { email, otp })
                const message = res?.data?.message || 'Email verified successfully.'
                setSuccessMessage(message)
                toast({ title: 'Verification successful', description: message })
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('pendingSignupEmail')
                }
                // Redirect to sign in so user can log in after verify
                setTimeout(() => router.push('/auth/sign-in'), 1200)
              } catch (err: any) {
                const apiErrorMessage =
                  err?.response?.data?.message ||
                  err?.response?.data?.error ||
                  err?.message ||
                  'Verification failed. Please check your code and try again.'
                setErrorMessage(apiErrorMessage)
                toast({ title: 'Verification failed', description: apiErrorMessage })
              } finally {
                setIsLoading(false)
              }
            }}
          >
            {/* Email */}
            <div className="relative">
              <div className={`flex items-center rounded-xl px-4 py-4 transition-all duration-300 ease-in-out ${
                emailFocused 
                  ? 'bg-blue-50 border-2 border-[#4043FF] shadow-lg shadow-blue-100' 
                  : 'bg-gray-100 border-2 border-transparent hover:bg-gray-50'
              }`}>
                <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-300 ${
                  emailFocused ? 'text-[#4043FF]' : 'text-gray-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <Input
                  type="email"
                  placeholder="info@alcott.com.ng"
                  className="border-0 bg-transparent p-0 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-500 flex-1"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* OTP */}
            <div className="relative">
              <div
                className={`flex flex-col rounded-xl px-4 py-5 transition-all duration-300 ease-in-out ${
                  otpFocused
                    ? 'bg-blue-50 border-2 border-[#4043FF] shadow-lg shadow-blue-100'
                    : 'bg-gray-100 border-2 border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center transition-colors duration-300 ${
                    otpFocused ? 'text-[#4043FF]' : 'text-gray-500'
                  }`}>
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.5304 0 1.0391.2107 1.4142.5858C13.7893 11.9609 14 12.4696 14 13v4c0 .5304-.2107 1.0391-.5858 1.4142C13.0391 18.7893 12.5304 19 12 19H8c-.5304 0-1.0391-.2107-1.4142-.5858C6.2107 18.0391 6 17.5304 6 17v-4c0-.5304.2107-1.0391.5858-1.4142C6.9609 11.2107 7.4696 11 8 11h4zM10 11V9a2 2 0 114 0v2m-6 4h8" />
                    </svg>
                    <span className="text-sm font-bold font-['Urbanist']">Enter 6-digit code</span>
                  </div>
                  <span className="text-xs text-gray-500 font-['Urbanist'] font-bold">Code expires in 10 minutes</span>
                </div>

                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/[^0-9]/g, '').slice(0, 6))}
                  onFocus={() => setOtpFocused(true)}
                  onBlur={() => setOtpFocused(false)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  containerClassName="justify-center"
                  className="w-full"
                >
                  <InputOTPGroup className="mx-auto flex gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-14 w-12 rounded-xl border-2 border-transparent bg-white text-lg font-bold text-gray-900 shadow-sm transition-all data-[active=true]:border-[#4043FF] data-[active=true]:shadow-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Feedback */}
            {errorMessage && (
              <p className="text-sm text-red-600 text-center font-['Urbanist'] font-bold">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600 text-center font-['Urbanist'] font-bold">{successMessage}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#4043FF] hover:bg-[#3333CC] text-white font-bold rounded-full font-['Urbanist'] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying…' : 'Verify email'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500 font-bold font-['Urbanist'] space-y-4">
            <p>Didn't receive the code? <span className="text-[#4043FF]">Check spam</span> or resend below.</p>
            <div className="flex flex-col items-center space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  if (!email) {
                    const msg = 'Enter your email before requesting a new code.'
                    setResendError(msg)
                    toast({ title: 'Missing email', description: msg })
                    return
                  }

                  setIsResending(true)
                  setResendError(null)
                  setResendMessage(null)

                  try {
                    const res = await apiClient.post('/auth/resend-verification', { email })
                    const message = res?.data?.message || 'Verification email sent successfully.'
                    setResendMessage(message)
                    toast({ title: 'Verification email sent', description: message })
                  } catch (err: any) {
                    const apiErrorMessage =
                      err?.response?.data?.message ||
                      err?.response?.data?.error ||
                      err?.message ||
                      'Could not resend verification email. Please try again later.'

                    setResendError(apiErrorMessage)
                    toast({ title: 'Resend failed', description: apiErrorMessage })
                  } finally {
                    setIsResending(false)
                  }
                }}
                disabled={isResending || !email}
                className="rounded-full border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white font-['Urbanist']"
              >
                {isResending ? 'Sending…' : 'Resend verification email'}
              </Button>
              {resendError && (
                <p className="text-xs text-red-600 font-['Urbanist'] font-bold">{resendError}</p>
              )}
              {resendMessage && (
                <p className="text-xs text-green-600 font-['Urbanist'] font-bold">{resendMessage}</p>
              )}
            </div>
            <p>
              Need to change your email?{' '}
              <Link href="/auth/register" className="font-bold text-[#4043FF] hover:text-[#3333CC] underline font-['Urbanist']">
                Start over
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


