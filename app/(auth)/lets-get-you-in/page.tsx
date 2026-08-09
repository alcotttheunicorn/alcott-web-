'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignInPage() {
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
            {/* Actual illustration */}
            <img
              src="/lets_get_you_in.png"
              alt="Let's get you in illustration"
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
                alt="Let's get you in illustration"
                className="w-64 h-auto"
              />
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center font-['Urbanist']">Let's get you in</h1>
            </div>

          {/* Social Sign In Buttons */}
          <div className="space-y-4 mb-6">
            <Button 
              variant="outline" 
              className="w-full h-14 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center gap-4 px-6 rounded-xl"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-bold text-gray-900 font-['Urbanist']">Continue with Google</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full h-14 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center gap-4 px-6 rounded-xl"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="font-bold text-gray-900 font-['Urbanist']">Continue with Apple</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="text-center mb-6">
            <span className="text-sm text-gray-500 font-bold font-['Urbanist']">or</span>
          </div>

          {/* Sign in with password button */}
          <div className="mb-6">
            <Button 
              type="button"
              className="w-full h-16 bg-[#4043FF] hover:bg-[#3333CC] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-['Urbanist']"
              onClick={() => window.location.href = '/sign-in'}
            >
              Sign in with password
            </Button>
          </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-500 font-bold font-['Urbanist']">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-[#4043FF] hover:text-[#3333CC] font-['Urbanist']">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
