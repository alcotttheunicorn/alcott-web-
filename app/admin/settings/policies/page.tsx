'use client'

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminModal } from '@/components/admin/AdminModal'
import { EmptyState } from '@/components/shared/EmptyState'
import { AdminListSkeleton } from '@/components/shared/skeletons'
import {
    useAdminPolicies,
    useCreateAdminPolicy,
    useUpdateAdminPolicy,
    useDeleteAdminPolicy,
    useAdminTermsOfUse,
    useCreateAdminTermOfUse,
    useUpdateAdminTermOfUse,
    useDeleteAdminTermOfUse,
    type PrivacyPolicy,
} from '@/hooks/use-admin'
import { toast } from '@/components/ui/use-toast'

const PAGE_SIZE = 10

function formatDateTime(value?: string) {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// UUIDs are 36 chars — show the distinguishing first 8 with the full value
// available on hover.
function shortId(id?: string) {
    if (!id) return '—'
    return id.length > 12 ? `${id.slice(0, 8)}…` : id
}

export default function PoliciesPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [documentType, setDocumentType] = useState<'privacy' | 'terms'>('privacy')
    const privacyQuery = useAdminPolicies({ page: currentPage, limit: PAGE_SIZE, enabled: documentType === 'privacy' })
    const termsQuery = useAdminTermsOfUse({ page: currentPage, limit: PAGE_SIZE, enabled: documentType === 'terms' })
    const createMutation = useCreateAdminPolicy()
    const updateMutation = useUpdateAdminPolicy()
    const deleteMutation = useDeleteAdminPolicy()
    const createTermsMutation = useCreateAdminTermOfUse()
    const updateTermsMutation = useUpdateAdminTermOfUse()
    const deleteTermsMutation = useDeleteAdminTermOfUse()

    const policies = documentType === 'privacy'
        ? privacyQuery.data?.data?.privacy_policies ?? []
        : termsQuery.data?.data?.terms_of_use ?? []
    const activeQuery = documentType === 'privacy' ? privacyQuery : termsQuery
    const loading = activeQuery.isLoading
    const queryError = activeQuery.error
    const totalPages = activeQuery.data?.totalPages || 1
    const totalItems = activeQuery.data?.totalItems ?? 0

    const error = queryError
        ? ((queryError as any)?.response?.status === 403 ? "You don't have admin access to manage these documents." : 'Could not load legal documents.')
        : ''

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPolicy, setEditingPolicy] = useState<PrivacyPolicy | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [version, setVersion] = useState('')
    const [effectiveDate, setEffectiveDate] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [formError, setFormError] = useState('')

    const saving = createMutation.isPending || updateMutation.isPending || createTermsMutation.isPending || updateTermsMutation.isPending

    const handleOpenCreate = () => {
        setEditingPolicy(null)
        setTitle('')
        setContent('')
        setVersion('')
        setEffectiveDate('')
        setIsActive(documentType === 'privacy')
        setFormError('')
        setIsModalOpen(true)
    }

    const handleOpenEdit = (policy: PrivacyPolicy) => {
        setEditingPolicy(policy)
        setTitle(policy.title ?? '')
        setContent(policy.content ?? '')
        setVersion(policy.version ?? '')
        setEffectiveDate(policy.effective_date ?? '')
        setIsActive(policy.is_active ?? true)
        setFormError('')
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        if (saving) return
        setIsModalOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!title.trim()) {
            setFormError('Please enter a policy title.')
            return
        }
        if (!content.trim()) {
            setFormError('Please enter the policy content.')
            return
        }

        const handleError = (err: any) => setFormError(
            err?.response?.data?.message ||
            (err?.response?.status === 403 ? "You don't have admin access to manage legal documents." : 'Could not save this document.')
        )
        const onSuccess = () => {
            toast({ title: `${documentType === 'terms' ? 'Terms of use' : 'Privacy policy'} ${editingPolicy ? 'updated' : 'created'}` })
            setIsModalOpen(false)
        }

        const payload = {
            title: title.trim(),
            content: content.trim(),
            version: version.trim(),
            effective_date: effectiveDate || new Date().toISOString(),
            is_active: isActive,
        }

        if (editingPolicy?.id) {
            if (documentType === 'terms') {
                updateTermsMutation.mutate({ id: editingPolicy.id, ...payload }, { onSuccess, onError: handleError })
            } else {
                updateMutation.mutate({ id: editingPolicy.id, ...payload }, { onSuccess, onError: handleError })
            }
            return
        }

        if (documentType === 'terms') {
            createTermsMutation.mutate(payload, { onSuccess, onError: handleError })
        } else {
            createMutation.mutate(payload, { onSuccess, onError: handleError })
        }
    }

    const handleDelete = (policy: PrivacyPolicy) => {
        if (!policy.id) return
        if (!window.confirm(`Delete policy "${policy.title ?? 'this policy'}"?`)) return

        const onSuccess = () => {
            toast({ title: `${documentType === 'terms' ? 'Terms of use' : 'Privacy policy'} deleted` })
            if (policies.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1)
        }
        const onError = (err: any) => toast({
            title: 'Delete failed',
            description: err?.response?.data?.message || 'Could not delete this document.',
        })
        const mutation = documentType === 'terms' ? deleteTermsMutation : deleteMutation
        mutation.mutate(policy.id, {
            onSuccess,
            onError,
        })
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            <AdminPageHeader title={documentType === 'terms' ? 'TERMS OF USE' : 'PRIVACY POLICIES'} backHref="/admin/users">
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 text-[#4043FF] hover:text-[#3333CC] transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">ADD</span>
                </button>
            </AdminPageHeader>

            <div className="mb-5 inline-flex rounded-lg border border-gray-200 bg-white p-1" role="tablist" aria-label="Legal document type">
                {(['privacy', 'terms'] as const).map((type) => (
                    <button
                        key={type}
                        type="button"
                        role="tab"
                        aria-selected={documentType === type}
                        onClick={() => {
                            setDocumentType(type)
                            setCurrentPage(1)
                            setEditingPolicy(null)
                            setIsModalOpen(false)
                        }}
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${documentType === type ? 'bg-[#4043FF] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        {type === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
                    </button>
                ))}
            </div>

            {loading ? (
                <AdminListSkeleton count={PAGE_SIZE} />
            ) : error ? (
                <EmptyState message={error} />
            ) : policies.length === 0 ? (
                <EmptyState message={`No ${documentType === 'terms' ? 'terms of use' : 'privacy policies'} yet. Click "ADD" to create one.`} />
            ) : (
                <>
                    <div className="space-y-6 lg:space-y-8 pl-2 lg:pl-6 pr-2 lg:pr-8">
                        {policies.map((policy) => {
                            const createdAt = formatDateTime(policy.created_at ?? policy.effective_date)
                            const effectiveAt = formatDateTime(policy.effective_date)
                            const activeDeleteMutation = documentType === 'terms' ? deleteTermsMutation : deleteMutation
                            const deleting = activeDeleteMutation.isPending && activeDeleteMutation.variables === policy.id

                            return (
                                <div key={policy.id ?? policy.title} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                            <h3 className="text-sm lg:text-base font-bold text-gray-900">{policy.title ?? 'Untitled policy'}</h3>
                                            {policy.is_active ? (
                                                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-green-100 text-green-700">Active</span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-gray-100 text-gray-500">Inactive</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-1 mb-1">
                                            <p className="text-xs lg:text-sm text-gray-600">
                                                ID: <span className="font-mono text-[#4043FF] font-medium" title={policy.id}>{shortId(policy.id)}</span>
                                            </p>
                                            {policy.version && (
                                                <p className="text-xs lg:text-sm text-gray-600">
                                                    Version: <span className="text-gray-700 font-medium">{policy.version}</span>
                                                </p>
                                            )}
                                            {effectiveAt && (
                                                <p className="text-xs lg:text-sm text-gray-600">
                                                    Effective: <span className="text-gray-700 font-medium">{effectiveAt}</span>
                                                </p>
                                            )}
                                            {createdAt && (
                                                <p className="text-xs lg:text-sm text-gray-600">
                                                    Created: <span className="text-gray-700 font-medium">{createdAt}</span>
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-xs lg:text-sm text-gray-500">{policy.content || '—'}</p>
                                    </div>

                                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                                        <button
                                            onClick={() => handleOpenEdit(policy)}
                                            disabled={deleting}
                                            className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                                            title="Edit policy"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(policy)}
                                            disabled={deleting}
                                            className="p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                            title="Delete policy"
                                        >
                                            <svg className={`w-5 h-5 text-red-500 ${deleting ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-[#4043FF] text-sm font-semibold hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                        >
                            &lt; Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-6 h-6 rounded text-sm font-semibold cursor-pointer ${currentPage === page ? 'bg-[#4043FF] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="text-[#4043FF] text-sm font-semibold hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                        >
                            Next &gt;
                        </button>
                    </div>

                    {totalItems > 0 && (
                        <p className="text-center text-xs text-gray-400 mt-3">
                            Showing page {currentPage} of {totalPages} ({totalItems} policies)
                        </p>
                    )}
                </>
            )}

            <AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title={`${editingPolicy ? 'Edit' : 'New'} ${documentType === 'terms' ? 'Terms of Use' : 'Privacy Policy'}`}>
                <form onSubmit={handleSubmit} className="p-4 lg:p-6">
                    <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="1. Types of Data We Collect"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Policy content…"
                            rows={6}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Version</label>
                            <input
                                type="text"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                placeholder="e.g. v1.0"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Effective date</label>
                            <input
                                type="datetime-local"
                                value={effectiveDate ? effectiveDate.slice(0, 16) : ''}
                                onChange={(e) => setEffectiveDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 accent-[#4043FF]"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>
                    {formError && (
                        <p className="text-sm text-red-600 mb-4">{formError}</p>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 bg-[#4043FF] text-white font-semibold rounded-lg hover:bg-[#3333CC] transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? 'SAVING...' : 'SUBMIT'}
                    </button>
                </form>
            </AdminModal>
        </div>
    )
}