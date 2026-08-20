'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/api/auth-api'
import { toast } from '@/components/ui/use-toast'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { EmailInput } from '@/components/auth/EmailInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const signUpMutation = useMutation({
    mutationFn: () => signUp(email, password),
  })
  const isLoading = signUpMutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    signUpMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('pendingSignupEmail', email)
        }

        const message = res?.message || 'Verification email sent. Please verify your email to continue.'
        setSuccessMessage(message)
        toast({ title: 'Signup successful', description: message })
        setTimeout(() => router.push('/verify-email'), 800)
      },
      onError: (err: any) => {
        const apiErrorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Signup failed. Please try again.'
        setErrorMessage(apiErrorMessage)
        toast({ title: 'Signup failed', description: apiErrorMessage })
      },
    })
  }

  return (
    <AuthLayout title="Create your Account">
      <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
        <EmailInput value={email} onChange={setEmail} placeholder="info@alcott.com.ng" required />
        <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" required />

        <div className="flex items-center justify-center">
          <div className="relative inline-flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="absolute opacity-0 w-5 h-5 cursor-pointer"
              onChange={(e) => {
                const checkbox = e.target as HTMLInputElement
                const customBox = checkbox.nextElementSibling as HTMLElement
                const checkmark = customBox.querySelector('svg') as SVGElement

                if (checkbox.checked) {
                  customBox.classList.add('bg-[#4043FF]', 'border-[#4043FF]')
                  customBox.classList.remove('bg-white', 'border-gray-300')
                  checkmark.classList.remove('opacity-0')
                  checkmark.classList.add('opacity-100')
                } else {
                  customBox.classList.remove('bg-[#4043FF]', 'border-[#4043FF]')
                  customBox.classList.add('bg-white', 'border-gray-300')
                  checkmark.classList.add('opacity-0')
                  checkmark.classList.remove('opacity-100')
                }
              }}
            />
            <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded flex items-center justify-center transition-all duration-200 cursor-pointer">
              <svg className="w-3 h-3 text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <label htmlFor="remember" className="ml-3 block text-sm text-gray-700 font-bold cursor-pointer" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            Remember me
          </label>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 text-center font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 text-center font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>{successMessage}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-[#4043FF] hover:bg-[#3333CC] text-white font-bold rounded-full disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
        >
          {isLoading ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>

      <SocialLoginButtons />

      <div className="text-center text-sm text-gray-500 font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
        Already have an account?{' '}
        <Link href="/sign-in" className="font-bold text-[#4043FF] hover:text-[#3333CC] underline" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
