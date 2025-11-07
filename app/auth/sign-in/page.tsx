'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api-client'
import { toast } from '@/components/ui/use-toast'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Please enter your email and password.')
      toast({
        title: 'Missing details',
        description: 'Please enter your email and password.',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.post('/auth/signin', {
        email,
        password,
      })

      const { user, token } = response?.data?.data || {}

      if (!user || !token) {
        throw new Error('Unexpected response from server. Please try again.')
      }

      if (!user.is_verified) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('pendingSignupEmail', user.email)
          // Ensure any previous auth data is cleared if user isn't verified
          localStorage.removeItem('authToken')
          localStorage.removeItem('authUser')
          sessionStorage.removeItem('authToken')
          sessionStorage.removeItem('authUser')
        }
        toast({
          title: 'Verify your email',
          description: 'Please verify your email before signing in.',
        })
        router.push('/auth/verify-email')
        return
      }

      if (typeof window !== 'undefined') {
        // Persist auth data
        const storage = rememberMe ? window.localStorage : window.sessionStorage
        storage.setItem('authToken', token)
        storage.setItem('authUser', JSON.stringify(user))
        // Clear any pending signup data
        window.localStorage.removeItem('pendingSignupEmail')
      }

      toast({
        title: 'Welcome back!',
        description: `Hello ${user.first_name || ''}!`,
      })

      router.push('/home')
    } catch (err: any) {
      const apiErrorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Sign-in failed. Please try again.'

      setErrorMessage(apiErrorMessage)
      toast({ title: 'Sign-in failed', description: apiErrorMessage })
    } finally {
      setIsLoading(false)
    }
  }
  
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

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-lg text-center">
            {/* Same illustration as register page */}
            <img
              src="/lets_get_you_in.png"
              alt="Login illustration"
              className="w-full h-auto max-w-md mx-auto"
            />
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-20 lg:pt-8">
          <div className="w-full max-w-md">
            {/* Mobile Illustration */}
            <div className="lg:hidden flex justify-center mb-8">
              <img
                src="/lets_get_you_in.png"
                alt="Login illustration"
                className="w-64 h-auto"
              />
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center lg:text-left font-['Urbanist']">Login to your Account</h1>
            </div>

            {/* Sign In Form */}
            <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
              {/* Email Field */}
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
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent p-0 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-500 flex-1"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className={`flex items-center rounded-xl px-4 py-4 transition-all duration-300 ease-in-out ${
                  passwordFocused 
                    ? 'bg-blue-50 border-2 border-[#4043FF] shadow-lg shadow-blue-100' 
                    : 'bg-gray-100 border-2 border-transparent hover:bg-gray-50'
                }`}>
                  <svg className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-300 ${
                    passwordFocused ? 'text-[#4043FF]' : 'text-gray-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent p-0 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-500 flex-1"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <button
                    type="button"
                    className={`ml-4 transition-colors duration-300 ${
                      passwordFocused ? 'text-[#4043FF] hover:text-[#3333CC]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      // Eye slash icon (password visible - click to hide)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      // Eye icon (password hidden - click to show)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-center">
                <div className="relative inline-flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="absolute opacity-0 w-5 h-5 cursor-pointer"
                    onChange={(e) => {
                      const checkbox = e.target as HTMLInputElement;
                      const customBox = checkbox.nextElementSibling as HTMLElement;
                      const checkmark = customBox.querySelector('svg') as SVGElement;
                      
                      if (checkbox.checked) {
                        customBox.classList.add('bg-[#4043FF]', 'border-[#4043FF]');
                        customBox.classList.remove('bg-white', 'border-gray-300');
                        checkmark.classList.remove('opacity-0');
                        checkmark.classList.add('opacity-100');
                      } else {
                        customBox.classList.remove('bg-[#4043FF]', 'border-[#4043FF]');
                        customBox.classList.add('bg-white', 'border-gray-300');
                        checkmark.classList.add('opacity-0');
                        checkmark.classList.remove('opacity-100');
                      }

                      setRememberMe(checkbox.checked)
                    }}
                  />
                  <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded flex items-center justify-center transition-all duration-200 cursor-pointer">
                    <svg className="w-3 h-3 text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <label htmlFor="remember" className="ml-3 block text-sm text-gray-700 font-bold cursor-pointer font-['Urbanist']">
                  Remember me
                </label>
              </div>

              {/* Sign In Button */}
              {errorMessage && (
                <p className="text-sm text-red-600 text-center font-['Urbanist'] font-bold">{errorMessage}</p>
              )}

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#4043FF] hover:bg-[#3333CC] text-white font-bold rounded-full font-['Urbanist'] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mb-8">
              <Link href="/auth/forgot-password" className="text-sm text-[#4043FF] hover:text-[#3333CC] font-bold font-['Urbanist']">
                Forgot the password?
              </Link>
            </div>

            {/* Divider */}
            <div className="text-center mb-8">
              <span className="text-sm text-gray-500 font-bold font-['Urbanist']">or continue with</span>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-8 mb-8">
              <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              
              <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-500 font-bold font-['Urbanist']">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-bold text-[#4043FF] hover:text-[#3333CC] underline font-['Urbanist']">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
