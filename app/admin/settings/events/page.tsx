'use client'

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminModal } from '@/components/admin/AdminModal'
import { EmptyState } from '@/components/shared/EmptyState'
import { AdminListSkeleton } from '@/components/shared/skeletons'
import {
    useAdminEvents,
    useCreateAdminEvent,
    useUpdateAdminEvent,
    useDeleteAdminEvent,
    type AdminEvent,
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

export default function EventsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const { data, isLoading: loading, error: queryError } = useAdminEvents({ page: currentPage, limit: PAGE_SIZE })
    const createMutation = useCreateAdminEvent()
    const updateMutation = useUpdateAdminEvent()
    const deleteMutation = useDeleteAdminEvent()

    const events = data?.data?.events ?? []
    const totalPages = data?.totalPages || 1
    const totalItems = data?.totalItems ?? 0

    const error = queryError
        ? ((queryError as any)?.response?.status === 403 ? "You don't have admin access to events." : 'Could not load events.')
        : ''

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null)
    const [eventName, setEventName] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [formError, setFormError] = useState('')

    const saving = createMutation.isPending || updateMutation.isPending

    const handleOpenCreate = () => {
        setEditingEvent(null)
        setEventName('')
        setEventDescription('')
        setFormError('')
        setIsModalOpen(true)
    }

    const handleOpenEdit = (event: AdminEvent) => {
        setEditingEvent(event)
        setEventName(event.name ?? '')
        setEventDescription(event.description ?? '')
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

        if (!eventName.trim()) {
            setFormError('Please enter an event name.')
            return
        }

        const handleError = (err: any) => setFormError(
            err?.response?.data?.message ||
            (err?.response?.status === 403 ? "You don't have admin access to manage events." : 'Could not save event.')
        )
        const onSuccess = () => {
            toast({ title: editingEvent ? 'Event updated' : 'Event created' })
            setIsModalOpen(false)
        }

        if (editingEvent?.id) {
            updateMutation.mutate(
                { id: editingEvent.id, name: eventName.trim(), description: eventDescription.trim() },
                { onSuccess, onError: handleError },
            )
            return
        }

        createMutation.mutate(
            { name: eventName.trim(), description: eventDescription.trim() },
            { onSuccess, onError: handleError },
        )
    }

    const handleDelete = (event: AdminEvent) => {
        if (!event.id) return
        if (!window.confirm(`Delete event "${event.name ?? 'this event'}"?`)) return

        deleteMutation.mutate(event.id, {
            onSuccess: () => {
                toast({ title: 'Event deleted' })
                // If we deleted the only row on the last page, step back one
                // page instead of showing an empty page.
                if (events.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1)
            },
            onError: (err: any) => toast({
                title: 'Delete failed',
                description: err?.response?.data?.message || 'Could not delete event.',
            }),
        })
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            <AdminPageHeader title="EVENT" backHref="/admin/users">
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 text-[#4043FF] hover:text-[#3333CC] transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-sm font-medium">ADD</span>
                </button>
            </AdminPageHeader>

            {loading ? (
                <AdminListSkeleton count={PAGE_SIZE} />
            ) : error ? (
                <EmptyState message={error} />
            ) : events.length === 0 ? (
                <EmptyState message='No events yet. Click "ADD" to create one.' />
            ) : (
                <>
                    <div className="space-y-6 lg:space-y-8 pl-2 lg:pl-6 pr-2 lg:pr-8">
                        {events.map((event) => {
                            const createdAt = formatDateTime(event.created_at)
                            const deleting = deleteMutation.isPending && deleteMutation.variables === event.id

                            return (
                                <div key={event.id ?? event.name} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">{event.name ?? 'Untitled event'}</h3>
                                        <div className="flex flex-wrap gap-x-6 gap-y-1 mb-1">
                                            <p className="text-xs lg:text-sm text-gray-600">
                                                ID: <span className="font-mono text-[#4043FF] font-medium" title={event.id}>{shortId(event.id)}</span>
                                            </p>
                                            {createdAt && (
                                                <p className="text-xs lg:text-sm text-gray-600">
                                                    Created: <span className="text-gray-700 font-medium">{createdAt}</span>
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-xs lg:text-sm text-gray-500">{event.description || '—'}</p>
                                    </div>

                                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                                        <button
                                            onClick={() => handleOpenEdit(event)}
                                            disabled={deleting}
                                            className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                                            title="Edit event"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event)}
                                            disabled={deleting}
                                            className="p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                            title="Delete event"
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
                                className={`w-6 h-6 rounded text-sm font-semibold ${currentPage === page ? 'bg-[#4043FF] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
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
                            Showing page {currentPage} of {totalPages} ({totalItems} events)
                        </p>
                    )}
                </>
            )}

            <AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title="Event Form">
                <form onSubmit={handleSubmit} className="p-4 lg:p-6">
                    <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">Name</label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Scheduled to depart on the next planned moveme..."
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <textarea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            placeholder="Description"
                            rows={5}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4043FF] focus:border-transparent outline-none resize-none"
                        />
                    </div>
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
