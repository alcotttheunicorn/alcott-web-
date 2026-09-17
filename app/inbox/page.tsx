'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'

export default function InboxPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Calls')

  const callData = [
    { name: 'Darren Kulikowski', status: 'Outgoing', date: 'Dec 20, 2024', color: 'bg-green-500' },
    { name: 'Tanner Stafford', status: 'Incoming', date: 'Dec 07, 2024', color: 'bg-blue-500' },
    { name: 'Pedro Hoard', status: 'Outgoing', date: 'Nov 19, 2024', color: 'bg-green-500' },
    { name: 'Marielle Wigington', status: 'Missed', date: 'Nov 12, 2024', color: 'bg-red-500' },
    { name: 'Annabel Rohan', status: 'Outgoing', date: 'Oct 23, 2024', color: 'bg-green-500' },
    { name: 'Titus Kitamura', status: 'Incoming', date: 'Oct 03, 2024', color: 'bg-blue-500' },
    { name: 'Chardette Hanlin', status: 'Missed', date: 'Oct 20, 2024', color: 'bg-red-500' },
    { name: 'Rosalie Ehrman', status: 'Outgoing', date: 'Oct 15, 2024', color: 'bg-green-500' }
  ]

  const chatData = [
    { name: 'Marvin McKinney', message: 'Hi, good morning too!', time: '10.00', unread: 1 },
    { name: 'Willard Purnell', message: 'omg, this is amazing 👍', time: '08.47', unread: 2 },
    { name: 'Daryl Nehls', message: 'I\'ll be there in 2 mins', time: '08.25', unread: 0 },
    { name: 'Sanjuanita Ordonez', message: 'Wow, this is really epic 😎', time: 'Yesterday', unread: 0 },
    { name: 'Lavern Laboy', message: 'How are you?', time: 'Dec 20, 2024', unread: 3 },
    { name: 'Edgar Torrey', message: 'just ideas for next time', time: 'Dec 19, 2024', unread: 0 },
    { name: 'Florencio Dorrance', message: 'perfect! 💯💯', time: 'Dec 18, 2024', unread: 0 },
    { name: 'Marielle Wigington', message: 'Thanks for the update', time: 'Dec 17, 2024', unread: 1 }
  ]

  return (
    <UserAppLayout activeNav="inbox">
      <div className="mx-auto w-full max-w-8xl p-4 lg:p-6 pb-20 lg:pb-6">
        {/* Header with Back Arrow */}
        <div className="flex items-center mb-6">
          <button className="mr-4 p-2 rounded-lg hover:bg-gray-100" onClick={() => router.back()}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>Inbox</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center space-x-4 mb-6 lg:mb-10">
          <button
            onClick={() => setActiveTab('Chats')}
            className={`px-6 lg:px-40 py-3 rounded-full border font-bold font-[Urbanist] transition-colors ${
              activeTab === 'Chats'
                ? 'bg-[#5B5FED] text-white border-[#5B5FED]'
                : 'border-[#5B5FED] text-[#5B5FED] bg-white hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab('Calls')}
            className={`px-6 lg:px-40 py-3 rounded-full border font-bold font-[Urbanist] transition-colors ${
              activeTab === 'Calls'
                ? 'bg-[#5B5FED] text-white border-[#5B5FED]'
                : 'border-[#5B5FED] text-[#5B5FED] bg-white hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}
          >
            Calls
          </button>
        </div>

        {/* Content List */}
        <div className="space-y-4 lg:space-y-10 px-4 lg:px-30">
          {activeTab === 'Calls' ? (
            callData.map((call, index) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 font-[Urbanist] truncate" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>
                      {call.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${call.color}`}></div>
                      <p className="text-sm text-gray-600 font-[Urbanist] truncate" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>
                        {call.status} | {call.date}
                      </p>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-[#5B5FED] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            chatData.map((chat, index) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 font-[Urbanist] truncate" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>
                      {chat.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-[Urbanist] truncate" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>
                      {chat.message}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1 shrink-0">
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-[#5B5FED] rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif' }}>
                        {chat.unread}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 font-[Urbanist]" style={{ fontFamily: 'Urbanist, system-ui, sans-serif', fontWeight: 'bold' }}>
                    {chat.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </UserAppLayout>
  )
}