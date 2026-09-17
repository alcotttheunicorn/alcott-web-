'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'

type FAQCategory = 'general' | 'account' | 'shipping' | 'cost'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: FAQCategory
}

export default function HelpCenterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq')
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('general')
  const [expandedFAQ, setExpandedFAQ] = useState<string>('what-is-alcott')
  const [faqSearch, setFaqSearch] = useState('')
  const [message, setMessage] = useState('')

  const faqs: FAQItem[] = [
    {
      id: 'what-is-alcott',
      question: 'What is Alcott?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      category: 'general',
    },

    
    {
      id: 'create-shipping',
      question: 'Can I create my own shipping?',
      answer: 'Yes, you can create your own shipping orders through the "New Shipment" feature. Fill in the sender and receiver details, package information, and select your preferred shipping option.',
      category: 'shipping',
    },
    {
      id: 'how-to-use',
      question: 'How to use Alcott?',
      answer: 'To use Alcott, simply create an account, add your shipping details, and start creating shipments. You can track your packages in real-time and manage all your shipping needs from one dashboard.',
      category: 'general',
    },
    
    {
      id: 'is-free',
      question: 'Is Alcott free to use?',
      answer: 'Alcott offers both free and premium features. Basic shipping services are available with a free account, while advanced features may require a subscription.',
      category: 'account',
    },
    {
      id: 'make-offer',
      question: 'How to make offer on Alcott?',
      answer: 'You can make offers on shipments through the marketplace feature. Browse available shipments and submit your bid through the offer system.',
      category: 'general',
    },
    {
      id: 'free-shipping',
      question: 'Can I get free shipping?',
      answer: 'Free shipping may be available for certain promotions or subscription plans. Check our current offers and subscription benefits for more details.',
      category: 'cost',
    },
    {
      id: 'question',
      question: 'Question',
      answer: 'This is a placeholder question. Please contact support for more information.',
      category: 'general',
    },
  ]

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? '' : id)
  }

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <UserAppLayout activeNav="home" contentBgClass="bg-white">
        <div className="mx-auto w-full max-w-8xl px-4 py-4 lg:px-6 lg:py-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Help Center</h1>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab('faq')}
                className={`flex-1 pb-3 px-1 font-semibold transition-colors ${
                  activeTab === 'faq'
                    ? 'text-[#4043FF] border-b-3 border-[#4043FF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={{ fontFamily: "'Urbanist', sans-serif" }}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 pb-3 px-1 font-semibold transition-colors ${
                  activeTab === 'contact'
                    ? 'text-[#4043FF] border-b-3 border-[#4043FF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={{ fontFamily: "'Urbanist', sans-serif" }}
              >
                Contact us
              </button>
            </div>

            {activeTab === 'faq' && (
              <>
                {/* Category Filters */}
                <div className="flex gap-3 mb-6">
                  {(['general', 'account', 'shipping', 'cost'] as FAQCategory[]).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`flex-1 px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                        activeCategory === category
                          ? 'bg-[#4043FF] text-white'
                          : 'bg-white border border-[#4043FF] text-[#4043FF] hover:bg-[#4043FF] hover:text-white'
                      }`}
                      style={{ fontFamily: "'Urbanist', sans-serif" }}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                {/* FAQ Search */}
                <div className="relative mb-6">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                    style={{ fontFamily: "'Urbanist', sans-serif" }}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>

                {/* FAQ List */}
                <div className="space-y-3 mb-8">
                  {filteredFAQs.map((faq) => {
                    const isExpanded = expandedFAQ === faq.id
                    return (
                      <div
                        key={faq.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-4" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {faq.question}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 text-gray-600" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {activeTab === 'contact' && (
              <div className="mb-8">
                <div className="space-y-3">
                  {/* Customer Service */}
                  <button className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                      <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                      Customer Service
                    </span>
                  </button>

                  {/* WhatsApp */}
                  <button className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                      <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                      WhatsApp
                    </span>
                  </button>

                  {/* Website */}
                  <button className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                      <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                      Website
                    </span>
                  </button>

                  {/* Facebook */}
                  <button className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                      <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                      Facebook
                    </span>
                  </button>

                  {/* Twitter */}
                  <button className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                      <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                      Twitter
                    </span>
                  </button>

                  {/* Instagram */}
                  <button className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                      <svg className="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                      Instagram
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                    style={{ fontFamily: "'Urbanist', sans-serif" }}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
                <button className="w-12 h-12 bg-[#4043FF] text-white rounded-full flex items-center justify-center hover:bg-[#3333CC] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
        </div>
    </UserAppLayout>
  )
}

