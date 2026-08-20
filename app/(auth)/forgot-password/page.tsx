'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { forgotPassword } from '@/lib/api/auth-api'
import { toast } from '@/components/ui/use-toast'
import { AuthLayout } from '@/components/auth/AuthLayout'

type Method = 'sms' | 'email'

interface MethodOption {
    method: Method
    label: string
    detail: string
    icon: string
}

const METHOD_OPTIONS: MethodOption[] = [
    {
        method: 'sms',
        label: 'via SMS',
        detail: '+234 111 •••••••99',
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    },
    {
        method: 'email',
        label: 'via Email',
        detail: 'i•••@alcott.com.ng',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
]

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null)
  const [contact, setContact] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const forgotPasswordMutation = useMutation({
    mutationFn: (method: Method) =>
      method === 'email' ? forgotPassword(contact.trim()) : forgotPassword(undefined, contact.trim()),
  })
  const isLoading = forgotPasswordMutation.isPending

  const handleMethodSelect = (method: Method) => {
    setSelectedMethod(method)
    if (typeof window !== 'undefined') {
      const saved = method === 'email' ? window.localStorage.getItem('pendingSignupEmail') : ''
      if (saved) setContact(saved)
    }
  }

  const handleContinue = () => {
    if (!selectedMethod || !contact.trim()) {
      const message = selectedMethod === 'email' ? 'Please enter your email address.' : 'Please enter your phone number.'
      setErrorMessage(message)
      toast({ title: 'Missing details', description: message })
      return
    }

    setErrorMessage(null)

    forgotPasswordMutation.mutate(selectedMethod, {
      onSuccess: (payload) => {
        if (typeof window !== 'undefined') {
          if (selectedMethod === 'email') {
            window.localStorage.setItem('pendingResetEmail', contact.trim())
          } else {
            window.localStorage.setItem('pendingResetPhone', contact.trim())
          }
        }

        toast({
          title: 'Reset link sent',
          description: payload?.message || 'A reset code has been sent to your contact details.',
        })
        router.push('/forgot-password/verify')
      },
      onError: (err: any) => {
        const apiErrorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Could not send the reset code. Please try again.'
        setErrorMessage(apiErrorMessage)
        toast({ title: 'Reset failed', description: apiErrorMessage })
      },
    })
  }

  return (
    <AuthLayout
      illustration="/forgot_password.png"
      illustrationAlt="Forgot password illustration"
      header={{ backHref: '/sign-in', title: 'Forgot Password' }}
      title="Select which contact details we should use to reset your password"
    >
      <div className="space-y-4 mb-6">
        {METHOD_OPTIONS.map((opt) => (
          <div
            key={opt.method}
            onClick={() => handleMethodSelect(opt.method)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedMethod === opt.method
                ? 'border-[#4043FF] bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={opt.icon} />
                </svg>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                      {opt.label}
                    </p>
                    <p className="text-base font-bold text-gray-900" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                      {opt.detail}
                    </p>
                  </div>

                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === opt.method
                      ? 'border-[#4043FF] bg-[#4043FF]'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {selectedMethod === opt.method && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
            {selectedMethod === 'email' ? 'Email address' : 'Phone number'}
          </label>
          <input
            type={selectedMethod === 'email' ? 'email' : 'tel'}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={selectedMethod === 'email' ? 'you@example.com' : '+234 800 000 0000'}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-[#4043FF] focus:bg-white focus:outline-none"
          />
        </div>
      )}

      {errorMessage && (
        <p className="mb-4 text-sm text-red-600 text-center font-bold">{errorMessage}</p>
      )}

      <Button
        onClick={handleContinue}
        disabled={!selectedMethod || !contact.trim() || isLoading}
        className="w-full h-12 bg-[#4043FF] hover:bg-[#3333CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-full"
        style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
      >
        {isLoading ? 'Sending…' : 'Continue'}
      </Button>
    </AuthLayout>
  )
}