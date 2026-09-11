'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminRateChecks, type RateCheck } from '@/hooks/use-admin'
import { EmptyState } from '@/components/shared/EmptyState'

interface RateEntry {
    id: string
    time: string
    date: string
    from: string
    to: string
    email: string
    phone: string
    price: number
    currency: string
    weight: string
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay()
}

function toRateEntry(rc: RateCheck): RateEntry {
    const createdAt = typeof rc.created_at === 'string' ? new Date(rc.created_at) : null
    const price = typeof rc.price === 'number' ? rc.price : typeof rc.total_price === 'number' ? rc.total_price : 0
    return {
        id: typeof rc.id === 'string' || typeof rc.id === 'number' ? String(rc.id) : '',
        time: createdAt ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        date: createdAt ? createdAt.toLocaleDateString('en-GB') : '',
        from: typeof rc.sender_address === 'string' ? rc.sender_address : '',
        to: typeof rc.receiver_address === 'string' ? rc.receiver_address : '',
        email: typeof rc.sender_email === 'string' ? rc.sender_email : '',
        phone: typeof rc.sender_phone_number === 'string' ? rc.sender_phone_number : '',
        price,
        currency: typeof rc.currency === 'string' ? rc.currency : 'NGN',
        weight: typeof rc.weight === 'number' ? `${rc.weight} KG` : '',
    }
}

export default function RatesCheckPage() {
    const now = new Date()
    const [currentYear, setCurrentYear] = useState(now.getFullYear())
    const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth())
    const [selectedDay, setSelectedDay] = useState(now.getDate())
    const [calendarOpen, setCalendarOpen] = useState(false)

    const { data, isLoading, error: queryError } = useAdminRateChecks({ limit: 100 })
    const errorMsg = queryError
        ? ((queryError as any)?.response?.status === 403
            ? "You don't have admin access to view rate checks."
            : 'Could not load rate checks.')
        : ''

    const rateEntries = useMemo(() => {
        const checks = data?.rateChecks ?? []
        return checks
            .filter((rc) => {
                if (!rc.created_at) return true
                const d = new Date(rc.created_at)
                return d.getFullYear() === currentYear && d.getMonth() === currentMonthIndex
            })
            .map(toRateEntry)
    }, [data, currentYear, currentMonthIndex])

    const currentMonth = `${MONTHS[currentMonthIndex].toUpperCase()} ${currentYear}`
    const calendarMonth = `${MONTHS[currentMonthIndex]} ${currentYear}`

    const handlePrevMonth = () => {
        if (currentMonthIndex === 0) {
            setCurrentMonthIndex(11)
            setCurrentYear(currentYear - 1)
        } else {
            setCurrentMonthIndex(currentMonthIndex - 1)
        }
    }

    const handleNextMonth = () => {
        if (currentMonthIndex === 11) {
            setCurrentMonthIndex(0)
            setCurrentYear(currentYear + 1)
        } else {
            setCurrentMonthIndex(currentMonthIndex + 1)
        }
    }

    const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthIndex)
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonthIndex - 1)

    // Build calendar grid
    const calendarDays: { day: number; isCurrentMonth: boolean }[] = []

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, isCurrentMonth: true })
    }

    // Next month days
    const remainingCells = 42 - calendarDays.length // 6 rows x 7 days
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays.push({ day: i, isCurrentMonth: false })
    }

    const handleDayClick = (day: number, isCurrentMonth: boolean) => {
        if (isCurrentMonth) {
            setSelectedDay(day)
            setCalendarOpen(false)
        }
    }

    return (
        <div className="p-4 lg:p-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <Link href="/admin/orders" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">RATE CHECK</h1>
            </div>

            {/* Month Navigation */}
            <div className="relative flex items-center gap-2 mb-6 lg:mb-8">
                <button
                    onClick={handlePrevMonth}
                    className="text-[#4043FF] hover:text-[#3333CC] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="text-[#4043FF] font-semibold text-sm hover:underline"
                >
                    {currentMonth}
                </button>
                <button
                    onClick={handleNextMonth}
                    className="text-[#4043FF] hover:text-[#3333CC] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Calendar Dropdown */}
                {calendarOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-64">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Calendar</h3>

                        {/* Calendar Month Navigation */}
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={handlePrevMonth}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-[#4043FF] font-semibold text-sm">{calendarMonth}</span>
                            <button
                                onClick={handleNextMonth}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Days of Week Header */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {DAYS.map((day, index) => (
                                <div key={index} className="text-center text-xs font-medium text-gray-400 py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.slice(0, 35).map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDayClick(item.day, item.isCurrentMonth)}
                                    className={`text-center text-sm py-1.5 rounded transition-colors ${item.isCurrentMonth
                                        ? item.day === selectedDay
                                            ? 'bg-[#4043FF] text-white'
                                            : 'text-gray-900 hover:bg-gray-100'
                                        : 'text-gray-300'
                                        }`}
                                >
                                    {item.day}
                                </button>
                            ))}
                        </div>

                        {/* Day Labels */}
                        <div className="grid grid-cols-7 gap-1 mt-2 text-[10px] text-gray-400">
                            <span className="text-center">MO</span>
                            <span className="text-center">TU</span>
                            <span className="text-center">WE</span>
                            <span className="text-center">TH</span>
                            <span className="text-center">FR</span>
                            <span className="text-center">SA</span>
                            <span className="text-center">SU</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Rate Entries List */}
            {errorMsg ? (
                <EmptyState message={errorMsg} />
            ) : isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4043FF]" />
                </div>
            ) : rateEntries.length === 0 ? (
                <EmptyState message="No rate checks found for this period." />
            ) : (
                <div className="space-y-6 lg:space-y-8">
                    {rateEntries.map((entry) => (
                        <div key={entry.id || `${entry.time}-${entry.email}`} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            {/* Left side - Entry details */}
                            <div className="space-y-1 flex-1 min-w-0">
                                <p className="text-base lg:text-lg font-bold text-gray-900">
                                    {entry.time}  {entry.date}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-600 wrap-break-word">
                                    <span className="font-semibold">From:</span> {entry.from}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-600 wrap-break-word">
                                    <span className="font-semibold">To:</span> {entry.to}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-600 wrap-break-word">
                                    <span className="font-semibold">By:</span> {entry.email}, {entry.phone}
                                </p>
                            </div>

                            {/* Right side - Price and weight */}
                            <div className="text-left sm:text-right shrink-0">
                                <p className="text-base lg:text-lg font-bold text-gray-900">
                                    {entry.currency} {entry.price.toLocaleString()}.00
                                </p>
                                <p className="text-xs lg:text-sm font-semibold text-gray-700">{entry.weight}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Click outside to close calendar */}
            {calendarOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCalendarOpen(false)}
                />
            )}
        </div>
    )
}