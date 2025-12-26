'use client'

import { useState } from 'react'
import Link from 'next/link'

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

// Mock data matching the screenshot
const mockRateEntries: RateEntry[] = [
    {
        id: '1',
        time: '06: 10 am',
        date: '22-08-25',
        from: '2001 Ed Bluestein Blvd Austin T78721 USA',
        to: '35 Enoma St. Ilasamaja, Lagos 102214, Lagos, Nigeria',
        email: 'freviaspieces@amail.com',
        phone: '08098031206',
        price: 170300,
        currency: 'NGN',
        weight: '300KG',
    },
    {
        id: '2',
        time: '06: 10 am',
        date: '22-08-25',
        from: '2001 Ed Bluestein Blvd Austin T78721 USA',
        to: '35 Enoma St. Ilasamaja, Lagos 102214, Lagos, Nigeria',
        email: 'freviaspieces@amail.com',
        phone: '08098031206',
        price: 170300,
        currency: 'NGN',
        weight: '300KG',
    },
    {
        id: '3',
        time: '06: 10 am',
        date: '22-08-25',
        from: '2001 Ed Bluestein Blvd Austin T78721 USA',
        to: '35 Enoma St. Ilasamaja, Lagos 102214, Lagos, Nigeria',
        email: 'freviaspieces@amail.com',
        phone: '08098031206',
        price: 170300,
        currency: 'NGN',
        weight: '300KG',
    },
]

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

export default function RatesCheckPage() {
    const [currentYear, setCurrentYear] = useState(2025)
    const [currentMonthIndex, setCurrentMonthIndex] = useState(8) // September = 8
    const [selectedDay, setSelectedDay] = useState(29)
    const [calendarOpen, setCalendarOpen] = useState(false)

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
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/orders" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-900">RATE CHECK</h1>
            </div>

            {/* Month Navigation */}
            <div className="relative flex items-center gap-2 mb-8">
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
            <div className="space-y-8">
                {mockRateEntries.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-start">
                        {/* Left side - Entry details */}
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-gray-900">
                                {entry.time}  {entry.date}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">From:</span> {entry.from}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">To:</span> {entry.to}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">By:</span> {entry.email}, {entry.phone}
                            </p>
                        </div>

                        {/* Right side - Price and weight */}
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                                {entry.currency} {entry.price.toLocaleString()}.00
                            </p>
                            <p className="text-sm font-semibold text-gray-700">{entry.weight}</p>
                        </div>
                    </div>
                ))}
            </div>

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
