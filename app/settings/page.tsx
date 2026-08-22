'use client'

import { useState } from 'react'
import { ChevronRight, LogOut, Moon, Bell, UserRound, Shield, CreditCard, Languages, Lock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { PageHeading } from '@/components/user/page-primitives'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'

const settings = [
  { label: 'Edit Profile', Icon: UserRound, href: '/profile-setup' }, 
  { label: 'Notification', Icon: Bell }, 
  { label: 'Payment', Icon: CreditCard }, 
  { label: 'Security', Icon: Shield }, 
  { label: 'Language', Icon: Languages, subtitle: 'English (US)' }, 
  { label: 'Privacy Policy', Icon: Lock }, 
  { label: 'Invite Friends', Icon: Users },
]

export default function SettingsPage() {
  const router = useRouter(); 
  const { logout } = useAuth(); 
  const { profile } = useProfile(); 
  const [darkMode, setDarkMode] = useState(false)
  return (
    <UserAppLayout activeNav="settings" contentBgClass="bg-[#F8F9FA]">
      <div className="max-w-2xl mx-auto p-4 lg:p-6">
        <PageHeading title="Settings" onBack={() => router.back()} />
        <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <p className="font-bold text-gray-900">{profile?.first_name ?? 'Profile'}</p>
            <p className="text-sm text-gray-500">Manage your account preferences</p>
          </div>
          {settings.map(({ label, Icon, href, subtitle }) => 
            <button 
              key={label} 
              onClick={() => href && router.push(href)} 
              className="w-full flex items-center gap-3 p-4 text-left border-b border-gray-100 hover:bg-gray-50"
            >
              <Icon className="w-5 h-5 text-[#4043FF]" />
              <span className="flex-1 font-semibold text-gray-900">{label}</span>
              {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <Moon className="w-5 h-5 text-[#4043FF]" />
            <span className="flex-1 font-semibold text-gray-900">Dark Mode</span>
            <button 
              onClick={() => setDarkMode((value) => !value)} 
              aria-pressed={darkMode} 
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-[#4043FF]' : 'bg-gray-200'}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </section>
      </div>
    </UserAppLayout>
  )
}
