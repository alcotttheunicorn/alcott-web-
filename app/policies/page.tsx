'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserAppLayout } from '@/components/layout/UserAppLayout'
import { PageHeading } from '@/components/user/page-primitives'
import { EmptyState } from '@/components/shared/EmptyState'
import { getPolicies } from '@/lib/api/policies-api'
import type { PolicySection } from '@/lib/policies-content'

export default function PoliciesPage() {
    const router = useRouter()
    const [policies, setPolicies] = useState<PolicySection[] | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancelled = false
        getPolicies()
            .then((res) => {
                if (cancelled) return
                const raw = res?.data as unknown
                const items = Array.isArray(raw)
                    ? raw
                    : Array.isArray((raw as { privacy_policies?: unknown })?.privacy_policies)
                        ? (raw as { privacy_policies: unknown[] }).privacy_policies
                        : (raw && typeof raw === 'object')
                            ? [raw]
                            : []
                setPolicies(
                    (items as { id?: string; title?: string; content?: string }[]).map((p, i) => ({
                        id: p.id ?? i,
                        title: p.title ?? '',
                        content: p.content ?? '',
                    })),
                )
            })
            .catch(() => {
                if (!cancelled) setError(true)
            })
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <UserAppLayout activeNav="settings" contentBgClass="bg-[#F8F9FA]">
            <div className="max-w-4xl mx-auto p-4 lg:p-6">
                <PageHeading title="Privacy Policy" onBack={() => router.back()} />
                <div className="bg-white rounded-xl border border-gray-100 p-5 lg:p-8">
                    {policies === null && !error ? (
                        <div className="text-center py-8 text-sm text-gray-400">Loading…</div>
                    ) : error || (policies && policies.length === 0) ? (
                        <EmptyState message="No privacy policy has been published yet." />
                    ) : (
                        <div className="space-y-8">
                            <p className="text-xs lg:text-sm text-gray-500 leading-relaxed">
                                Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            {policies!.map((policy) => (
                                <section key={policy.id}>
                                    <h2 className="text-sm lg:text-base font-bold text-gray-900 mb-3">{policy.title}</h2>
                                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">{policy.content}</p>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserAppLayout>
    )
}