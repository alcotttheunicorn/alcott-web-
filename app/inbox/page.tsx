'use client'

import { useState } from 'react'
import { Phone, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { PageHeading, StatusTabs } from '@/components/user/page-primitives'

const calls = [
  { name: 'Darren Kulikowski', detail: 'Outgoing | Dec 20, 2024', color: 'bg-green-500' },
  { name: 'Tanner Stafford', detail: 'Incoming | Dec 07, 2024', color: 'bg-blue-500' },
  { name: 'Pedro Hoard', detail: 'Outgoing | Nov 19, 2024', color: 'bg-green-500' },
  { name: 'Marielle Wigington', detail: 'Missed | Nov 12, 2024', color: 'bg-red-500' },
]
const chats = [
  { name: 'Marvin McKinney', detail: 'Hi, good morning too!', time: '10.00', unread: 1 },
  { name: 'Willard Purnell', detail: 'omg, this is amazing', time: '08.47', unread: 2 },
  { name: 'Daryl Nehls', detail: "I'll be there in 2 mins", time: '08.25', unread: 0 },
  { name: 'Sanjuanita Ordonez', detail: 'Wow, this is really epic', time: 'Yesterday', unread: 0 },
]

function ContactRow({ name, detail, action, meta }: { name: string; detail: string; action?: boolean; meta: React.ReactNode }) {
  return <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3 min-w-0"><div className="w-9 h-9 rounded-full bg-gray-200 grid place-items-center shrink-0"><UserRound className="w-4 h-4 text-gray-600" /></div><div className="min-w-0"><h2 className="font-bold text-gray-900">{name}</h2><p className="text-sm text-gray-600 truncate">{detail}</p></div></div>
    {action ? <button aria-label={`Call ${name}`} className="p-2 text-[#5B5FED] hover:bg-gray-100 rounded-lg"><Phone className="w-5 h-5" /></button> : meta}
  </div>
}

export default function InboxPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'Chats' | 'Calls'>('Calls')
  return <UserAppLayout activeNav="inbox" inboxBadge contentBgClass="bg-[#F8F9FA]">
    <div className="max-w-4xl mx-auto p-4 lg:p-6">
      <PageHeading title="Inbox" onBack={() => router.back()} />
      <StatusTabs options={[{ value: 'Chats', label: 'Chats' }, { value: 'Calls', label: 'Calls' }] as const} value={tab} onChange={setTab} />
      <div className="divide-y divide-gray-100">
        {tab === 'Calls' ? calls.map((call) => <ContactRow key={call.name} {...call} action meta={<span className={`w-2 h-2 rounded-full ${call.color}`} />} />) : chats.map((chat) => <ContactRow key={chat.name} name={chat.name} detail={chat.detail} meta={<div className="text-right text-xs text-gray-500">{chat.unread > 0 && <span className="inline-grid place-items-center w-5 h-5 mb-1 rounded-full bg-[#5B5FED] text-white">{chat.unread}</span>}<div>{chat.time}</div></div>} />)}
      </div>
    </div>
  </UserAppLayout>
}
