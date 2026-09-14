'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImagePicker } from '@/components/ui/image-picker'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { LocationAutocompleteInput } from '@/components/ui/location-autocomplete-input'
import { useRouter } from 'next/navigation'
import { useSetupProfile } from '@/hooks/use-profile'
import { toast } from '@/components/ui/use-toast'

export default function ProfileSetupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    gender: '',
    address: '',
    profileImage: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const router = useRouter()
  const setupProfileMutation = useSetupProfile()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageSelect = (file: File, previewUrl: string) => {
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }))
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          setFormData(prev => ({
            ...prev,
            email: parsed.email || prev.email,
            firstName: prev.firstName || parsed.first_name || '',
            lastName: prev.lastName || parsed.last_name || ''
          }))
        } catch (error) {
          console.error('Failed to parse stored user', error)
        }
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'gender', 'address']
    const missingField = requiredFields.find((field) => !(formData as any)[field])
    if (missingField) {
      const message = 'Please fill in all required fields before continuing.'
      setErrorMessage(message)
      toast({ title: 'Missing information', description: message })
      return
    }

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
        : null

    if (!token) {
      const message = 'You need to sign in before setting up your profile.'
      setErrorMessage(message)
      toast({ title: 'Not signed in', description: message })
      router.push('/sign-in')
      return
    }

    const payload = new FormData()
    payload.append('first_name', formData.firstName)
    payload.append('last_name', formData.lastName)
    payload.append('dob', new Date(formData.dateOfBirth).toISOString())
    payload.append('gender', formData.gender)
    payload.append('address', formData.address)
    payload.append('phone_number', formData.phoneNumber)
    if (formData.profileImage) {
      payload.append('profile_pic', formData.profileImage)
    }

    setIsSubmitting(true)

    try {
      await setupProfileMutation.mutateAsync(payload)
      const message = 'Profile created successfully.'
      setSuccessMessage(message)
      toast({ title: 'Profile complete', description: message })

      setTimeout(() => {
        router.push('/profile-setup/success')
      }, 800)
    } catch (err: any) {
      const apiErrorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Unable to complete profile setup. Please try again.'
      setErrorMessage(apiErrorMessage)
      toast({ title: 'Profile setup failed', description: apiErrorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinueToAddress = () => {
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'gender']
    const missingField = requiredFields.find((field) => !(formData as any)[field])
    if (missingField) {
      const message = 'Please fill in all required fields before continuing.'
      setErrorMessage(message)
      toast({ title: 'Missing information', description: message })
      return
    }
    setErrorMessage(null)
    setStep(2)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <Link href="/register" className="mr-4">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
          {step === 1 ? 'Fill Your Profile' : 'Pin Your Address Location'}
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto flex w-full max-w-8xl">
        {step === 2 ? (
          <div className="w-full max-w-3xl mx-auto px-6 py-8 lg:py-12">
            <p className="text-sm text-gray-500 mb-4">Confirm the address where your deliveries can be collected.</p>
            <div className="relative z-10 rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
              <LocationAutocompleteInput
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                placeholder="Search for your address"
                country="NG"
                className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none"
              />
            </div>
            <div className="relative mt-2 h-72 overflow-hidden rounded-xl border border-[#D9DBFF] bg-[#EEF0FF]">
              <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(24deg, transparent 46%, #ffffff 47%, #ffffff 52%, transparent 53%), linear-gradient(112deg, transparent 42%, #ffffff 43%, #ffffff 48%, transparent 49%), linear-gradient(165deg, transparent 61%, #ffffff 62%, #ffffff 66%, transparent 67%)', backgroundSize: '150px 100px, 180px 130px, 210px 150px' }} />
              <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[#4043FF] shadow-lg">
                <div className="h-3 w-3 rounded-full bg-white" />
              </div>
              <div className="absolute left-[22%] top-[28%] h-3 w-3 rounded-full bg-[#777BFF] shadow-[0_0_0_8px_rgba(64,67,255,0.15)]" />
              <div className="absolute right-[24%] bottom-[24%] h-3 w-3 rounded-full bg-[#777BFF] shadow-[0_0_0_8px_rgba(64,67,255,0.15)]" />
            </div>
            {errorMessage && <p className="mt-3 text-center text-sm font-semibold text-red-600">{errorMessage}</p>}
            <div className="mt-5 flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-12 rounded-full px-6">Back</Button>
              <Button type="button" onClick={() => (document.getElementById('profile-submit-form') as HTMLFormElement | null)?.requestSubmit()} disabled={isSubmitting || !formData.address.trim()} className="h-12 flex-1 rounded-full bg-[#4043FF] font-bold text-white hover:bg-[#3333CC] disabled:opacity-60">
                {isSubmitting ? 'Saving profile…' : 'Continue'}
              </Button>
            </div>
            <form id="profile-submit-form" onSubmit={handleSubmit} className="hidden" />
          </div>
        ) : (
        <>
        {/* Left Side - Form (60% width) */}
        <div className="w-full lg:w-3/5 p-6">
          <form className="space-y-6 max-w-sm" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <Input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist] font-bold placeholder:font-bold"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <Input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist] font-bold placeholder:font-bold"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <Input
                type="date"
                placeholder="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full h-12 px-4 pr-12 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist] font-bold placeholder:font-bold"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                required
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full h-12 px-4 pr-12 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist] font-bold placeholder:font-bold"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                required
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Phone Number */}
            <div className="relative">
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50">
                  <div className="w-6 h-4 bg-green-500 mr-2"></div>
                  <span className="text-gray-600 font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>NG</span>
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="flex-1 h-12 px-4 border border-gray-200 rounded-r-lg rounded-l-none text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent font-[Urbanist] font-bold placeholder:font-bold"
                  style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full h-12 px-4 pr-12 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent appearance-none bg-white font-[Urbanist] font-bold"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
                required
              >
                <option value="" className="text-gray-500 font-bold">Gender</option>
                <option value="MALE" className="font-bold">Male</option>
                <option value="FEMALE" className="font-bold">Female</option>
                <option value="OTHER" className="font-bold">Other</option>
              </select>
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 text-center font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600 text-center font-[Urbanist] font-bold" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                {successMessage}
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="button"
                onClick={handleContinueToAddress}
                disabled={isSubmitting}
                className="w-full h-12 bg-[#4043FF] hover:bg-[#3333CC] text-white font-bold rounded-full font-[Urbanist] max-w-sm disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}
              >
                Continue
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side - Profile Image (40% width) */}
        <div className="hidden lg:flex w-2/5 items-center justify-center p-6">
          <ImagePicker 
            onImageSelect={handleImageSelect}
            className=""
          />
        </div>
        </>
        )}
        </div>
      </div>
    </div>
  )
}