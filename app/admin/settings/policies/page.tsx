'use client'

import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

interface PolicySection {
    id: number
    title: string
    content: string
}

const DEFAULT_POLICIES: PolicySection[] = [
    {
        id: 1,
        title: '1. Types of Data We Collect',
        content: 'Alcott collects personal data you provide directly, including your first and last name, email address, phone number, date of birth, gender, and residential address. We also collect shipping-related details such as sender and receiver names, contact details, delivery addresses, and package information (category, weight, and dimensions) needed to complete an order. Payment information is processed securely through our payment providers; we do not store your full card details on our servers.',
    },
    {
        id: 2,
        title: '2. Use of Your Personal Data',
        content: 'We use your personal data to create and manage your Alcott account, process and deliver your shipments, communicate order status and delivery updates, and provide customer support. We also use your data to improve our services, prevent fraud, and comply with applicable legal and regulatory obligations. Where required, we will request your consent before using your data for marketing purposes, and you may withdraw that consent at any time.',
    },
    {
        id: 3,
        title: '3. Disclosure of Your Personal Data',
        content: 'We do not sell your personal data. We may share your data with service providers and partners who help us operate our platform — including payment processors, logistics and courier partners, and cloud infrastructure providers — solely to the extent necessary to provide our services. We may also disclose your data where required by law, regulation, or legal process, or to protect the rights, property, and safety of Alcott, our users, or the public.',
    },
    {
        id: 4,
        title: '4. Data Retention and Security',
        content: 'We retain your personal data for as long as your account is active or as needed to provide our services, and for a reasonable period afterwards to comply with legal, tax, and audit requirements. We apply industry-standard technical and organizational measures to protect your data against unauthorised access, alteration, disclosure, or destruction, including encryption in transit and at rest and access controls on our systems.',
    },
    {
        id: 5,
        title: '5. Your Rights and Choices',
        content: 'You may access, correct, or update your personal information at any time from your profile settings. You may also request deletion of your account and personal data, subject to legal retention obligations, or object to or restrict certain processing. To exercise any of these rights, or to make a complaint about how we handle your data, please contact our support team.',
    },
]

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<PolicySection[]>(DEFAULT_POLICIES)
    const [editing, setEditing] = useState(false)
    const [drafts, setDrafts] = useState(DEFAULT_POLICIES)

    const startEdit = () => {
        setDrafts(DEFAULT_POLICIES)
        setEditing(true)
    }

    const cancelEdit = () => setEditing(false)

    const saveEdit = () => {
        setPolicies(drafts)
        setEditing(false)
        toast({ title: 'Policies saved', description: 'Changes to the policy content were saved.' })
    }

    const updateDraft = (id: number, field: 'title' | 'content', value: string) => {
        setDrafts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
    }

    const visible = editing ? drafts : policies

    return (
        <div className="p-6 lg:p-8 w-full overflow-x-hidden">
            <AdminPageHeader title="POLICIES" backHref="/admin/users">
                {editing ? (
                    <div className="flex items-center gap-3">
                        <button onClick={cancelEdit} className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                            CANCEL
                        </button>
                        <button onClick={saveEdit} className="flex items-center gap-1.5 text-[#4043FF] hover:text-[#3333CC] transition-colors cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium">SAVE</span>
                        </button>
                    </div>
                ) : (
                    <button onClick={startEdit} className="flex items-center gap-1.5 text-[#4043FF] hover:text-[#3333CC] transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span className="text-sm font-medium">EDIT</span>
                    </button>
                )}
            </AdminPageHeader>

            <div className="space-y-8 lg:space-y-10 pl-4 lg:pl-8 pr-4 lg:pr-16 max-w-8xl">
                {visible.map((policy) => (
                    <div key={policy.id}>
                        {editing ? (
                            <>
                                <input
                                    value={policy.title}
                                    onChange={(e) => updateDraft(policy.id, 'title', e.target.value)}
                                    className="w-full mb-3 text-sm lg:text-base font-bold text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                                />
                                <textarea
                                    value={policy.content}
                                    onChange={(e) => updateDraft(policy.id, 'content', e.target.value)}
                                    rows={6}
                                    className="w-full text-xs lg:text-sm text-gray-600 leading-relaxed bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4043FF] focus:border-transparent"
                                />
                            </>
                        ) : (
                            <>
                                <h2 className="text-sm lg:text-base font-bold text-gray-900 mb-3">{policy.title}</h2>
                                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">{policy.content}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}