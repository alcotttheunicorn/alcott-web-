'use client'

import { useState } from 'react'
import Link from 'next/link'

const mockEvents = [
    {
        id: 1,
        title: 'Scheduled to depart on the next planned movement',
        orderId: '1244-244898-2595',
        description: 'Due to travel restrictions, the package would depart next week Monday',
    },
    {
        id: 2,
        title: 'Clearance delay, held by a regulatory agency',
        orderId: '1244-244898-2595',
        description: 'Package on hold by NAFDAC',
    },
    {
        id: 3,
        title: 'Scheduled to depart on the next planned movement',
        orderId: '1244-244898-2595',
        description: 'Due to travel restrictions, the package would depart next week Monday',
    },
    {
        id: 4,
        title: 'Scheduled to depart on the next planned movement',
        orderId: '1244-244898-2595',
        description: 'Due to travel restrictions, the package would depart next week Monday',
    },
    {
        id: 5,
        title: 'Scheduled to depart on the next planned movement',
        orderId: '1244-244898-2595',
        description: 'Due to travel restrictions, the package would depart next week Monday',
    },
]

export default function EventsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [eventName, setEventName] = useState('')
    const [eventDescription, setEventDescription] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission - for now just close modal
        console.log('Event submitted:', { name: eventName, description: eventDescription })
        setEventName('')
        setEventDescription('')
        setIsModalOpen(false)
    }

    return (
        <div className="p-4 lg:p-6 w-full overflow-x-hidden">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
                <div className="flex items-center gap-2">
                    <Link href="/admin/users" className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-sm lg:text-base font-bold text-gray-900 tracking-wide">EVENT</h1>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 text-[#4043FF] hover:text-[#3333CC] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-sm font-medium">ADD</span>
                </button>
            </div>

            {/* Events List */}
            <div className="space-y-6 lg:space-y-8 pl-2 lg:pl-6 pr-2 lg:pr-8">
                {mockEvents.map((event) => (
                    <div key={event.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-xs lg:text-sm text-gray-600 mb-1">
                                Order ID: <span className="text-[#4043FF] font-medium">{event.orderId}</span>
                            </p>
                            <p className="text-xs lg:text-sm text-gray-500">{event.description}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                            {/* Edit Button */}
                            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            {/* Delete Button */}
                            <button className="p-2 hover:bg-red-50 rounded transition-colors">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Event Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-[#4043FF] px-4 py-3 flex items-center justify-between">
                            <h2 className="text-white font-semibold text-sm lg:text-base">Order Event Form</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-4 lg:p-6">
                            {/* Name Field */}
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

                            {/* Description Field */}
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-[#4043FF] text-white font-semibold rounded-lg hover:bg-[#3333CC] transition-colors text-sm"
                            >
                                SUBMIT
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
