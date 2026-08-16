'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/lib/api/auth-api'
import { toast } from '@/components/ui/use-toast'

export default function CreateNewPasswordPage() {
  const router = useRouter()
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(window.localStorage.getItem('pendingResetEmail') || '')
      setOtp(window.localStorage.getItem('pendingResetOtp') || '')
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContinue = async () => {
    if (!email || !otp) {
      const message = 'Reset session is missing. Please start the forgot-password flow again.'
      setErrorMessage(message)
      toast({ title: 'Reset session missing', description: message })
      return
    }

    if (!passwords.newPassword || !passwords.confirmPassword) {
      const message = 'Please enter and confirm your new password.'
      setErrorMessage(message)
      toast({ title: 'Missing password', description: message })
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      const message = 'Passwords do not match.'
      setErrorMessage(message)
      toast({ title: 'Passwords do not match', description: message })
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await resetPassword(email, otp, passwords.newPassword)

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('pendingResetEmail')
        window.localStorage.removeItem('pendingResetPhone')
        window.localStorage.removeItem('pendingResetOtp')
      }

      toast({
        title: 'Password updated',
        description: response?.message || 'Your password has been changed successfully.',
      })

      router.push('/sign-in')
    } catch (err: any) {
      const apiErrorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Password reset failed. Please try again.'
      setErrorMessage(apiErrorMessage)
      toast({ title: 'Reset failed', description: apiErrorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <Link href="/forgot-password/verify" className="mr-4">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          Create New Password
        </h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-lg">
            <img src="/create_new_password_after_otp.png" alt="Create new password illustration" className="w-full h-auto" />
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Create Your New Password
              </h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="relative">
                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200 focus-within:border-[#4043FF] focus-within:bg-white transition-all duration-300">
                  <svg className="w-5 h-5 text-gray-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="border-0 bg-transparent p-0 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-500 flex-1 font-[Urbanist] font-bold placeholder:font-bold"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                  />
                  <button
                    type="button"
                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200 focus-within:border-[#4043FF] focus-within:bg-white transition-all duration-300">
                  <svg className="w-5 h-5 text-gray-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={passwords.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="border-0 bg-transparent p-0 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-500 flex-1 font-[Urbanist] font-bold placeholder:font-bold"
                    style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                  />
                  <button
                    type="button"
                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="relative inline-flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="absolute opacity-0 w-5 h-5 cursor-pointer"
                />
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  rememberMe
                    ? 'bg-[#4043FF] border-[#4043FF]'
                    : 'bg-white border-gray-300'
                }`}>
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <label htmlFor="remember" className="ml-3 block text-sm text-gray-700 font-bold cursor-pointer font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                Remember me
              </label>
            </div>

            {errorMessage && (
              <p className="mb-4 text-sm text-red-600 text-center font-[Urbanist] font-bold">{errorMessage}</p>
            )}

            <Button
              onClick={handleContinue}
              disabled={!passwords.newPassword || !passwords.confirmPassword || isLoading}
              className="w-full h-12 bg-[#4043FF] hover:bg-[#3333CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-full font-[Urbanist]"
              style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
            >
              {isLoading ? 'Updating…' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
