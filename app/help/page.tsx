'use client'

import { useState } from 'react'
import { ChevronDown, Globe, Headphones, MessageCircle, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { PageHeading, StatusTabs } from '@/components/user/page-primitives'

type Category = 'general' | 'account' | 'shipping' | 'cost'

const faqs = [
  { id: 'what-is-alcott', category: 'general' as Category, question: 'What is Alcott?', answer: 'Alcott helps you create, manage, and track shipping orders in one place.' },
  { id: 'how-to-use', category: 'general' as Category, question: 'How do I use Alcott?', answer: 'Create an account, add shipment details, and track each package from your dashboard.' },
  { id: 'create-shipping', category: 'shipping' as Category, question: 'Can I create my own shipping?', answer: 'Yes. Use New Shipment to provide sender, receiver, package, and payment details.' },
  { id: 'is-free', category: 'account' as Category, question: 'Is Alcott free to use?', answer: 'Account creation is free. Shipping costs depend on shipment details and selected service.' },
  { id: 'free-shipping', category: 'cost' as Category, question: 'Can I get free shipping?', answer: 'Free shipping may be available through specific offers and promotions.' },
]

const contactChannels = [
  { label: 'Customer service', Icon: Headphones },
  { label: 'WhatsApp', Icon: MessageCircle },
  { label: 'Website', Icon: Globe },
]

function FAQAccordion({ category, search }: { category: Category; search: string }) {
  const [openId, setOpenId] = useState('what-is-alcott')
  const items = faqs.filter((faq) => faq.category === category && `${faq.question} ${faq.answer}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="space-y-3">{items.map((faq) => <article key={faq.id} className="rounded-lg border bg-gray-50"><button onClick={() => setOpenId(openId === faq.id ? '' : faq.id)} className="w-full p-4 flex justify-between text-left font-semibold"><span>{faq.question}</span><ChevronDown className={`w-5 h-5 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} /></button>{openId === faq.id && <p className="px-4 pb-4 text-gray-600">{faq.answer}</p>}</article>)}{!items.length && <p className="py-8 text-center text-gray-500">No matching questions.</p>}</div>
}

function FAQPanel() {
  const [category, setCategory] = useState<Category>('general')
  const [search, setSearch] = useState('')
  return <><div className="flex flex-wrap gap-2 mb-5">{(['general', 'account', 'shipping', 'cost'] as Category[]).map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 capitalize ${category === item ? 'bg-[#4043FF] text-white' : 'border text-[#4043FF]'}`}>{item}</button>)}</div><label className="relative block mb-5"><Search className="absolute left-3 top-3 w-5 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search help" className="w-full rounded-lg border py-3 pl-10 pr-4" /></label><FAQAccordion category={category} search={search} /></>
}

function ContactPanel() { return <div className="space-y-3">{contactChannels.map(({ label, Icon }) => <button key={label} className="w-full flex items-center gap-4 rounded-lg bg-gray-50 p-4 text-left hover:bg-gray-100"><Icon className="w-6 h-6 text-[#4043FF]" /><span className="font-semibold">{label}</span></button>)}</div> }

export default function HelpPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'faq' | 'contact'>('faq')
  const tabs = [
    { value: 'faq', label: 'FAQ' },
    { value: 'contact', label: 'Contact us' },
  ] as const

  return (
    <UserAppLayout contentBgClass="bg-white">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <PageHeading title="Help Center" onBack={() => router.back()} />
        <StatusTabs options={tabs} value={tab} onChange={setTab} />
        {tab === 'faq' ? <FAQPanel /> : <ContactPanel />}
      </div>
    </UserAppLayout>
  )
}
