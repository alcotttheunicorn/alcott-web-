'use client'

import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/lib/api/auth-api'
import { toast } from '@/components/ui/use-toast'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PasswordInput } from '@/components/auth/PasswordInput'

export default function CreateNewPasswordPage() {
  const router = useRouter()
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resetPasswordMutation = useMutation({
    mutationFn: () => resetPassword(email, otp, passwords.newPassword),
  })
  const isLoading = resetPasswordMutation.isPending

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(window.localStorage.getItem('pendingResetEmail') || '')
      setOtp(window.localStorage.getItem('pendingResetOtp') || '')
    }
  }, [])

  const handleContinue = () => {
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

    setErrorMessage(null)

    resetPasswordMutation.mutate(undefined, {
      onSuccess: (response) => {
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
      },
      onError: (err: any) => {
        const apiErrorMessage =
          err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Password reset failed. Please try again.'
        setErrorMessage(apiErrorMessage)
        toast({ title: 'Reset failed', description: apiErrorMessage })
      },
    })
  }

  return (
    <AuthLayout
      illustration="/create_new_password_after_otp.png"
      illustrationAlt="Create new password illustration"
      header={{ backHref: '/forgot-password/verify', title: 'Create New Password' }}
      title="Create Your New Password"
    >
      <div className="space-y-6 mb-8">
        <PasswordInput
          value={passwords.newPassword}
          onChange={(value) => setPasswords((prev) => ({ ...prev, newPassword: value }))}
          placeholder="New Password"
          autoComplete="new-password"
        />
        <PasswordInput
          value={passwords.confirmPassword}
          onChange={(value) => setPasswords((prev) => ({ ...prev, confirmPassword: value }))}
          placeholder="Confirm Password"
          autoComplete="new-password"
        />
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
            rememberMe ? 'bg-[#4043FF] border-[#4043FF]' : 'bg-white border-gray-300'
          }`}>
            {rememberMe && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        <label htmlFor="remember" className="ml-3 block text-sm text-gray-700 font-bold cursor-pointer" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          Remember me
        </label>
      </div>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-600 text-center font-bold">{errorMessage}</p>
      )}

      <Button
        onClick={handleContinue}
        disabled={!passwords.newPassword || !passwords.confirmPassword || isLoading}
        className="w-full h-12 bg-[#4043FF] hover:bg-[#3333CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-full"
        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
      >
        {isLoading ? 'Updating…' : 'Continue'}
      </Button>
    </AuthLayout>
  )
}