'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorBanner } from '@/components/shared/ErrorBanner'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { RateEntryCard } from '@/components/admin/RateEntryCard'
import { CalendarPicker } from '@/components/admin/CalendarPicker'

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

const mockRateEntries: RateEntry[] = [
    { id: '1', time: '06: 10 am', date: '22-08-25', from: '2001 Ed Bluestein Blvd Austin T78721 USA', to: '35 Enoma St. Ilasamaja, Lagos 102214, Lagos, Nigeria', email: 'freviaspieces@amail.com', phone: '08098031206', price: 170300, currency: 'NGN', weight: '300KG' },
    { id: '2', time: '06: 10 am', date: '22-08-25', from: '2001 Ed Bluestein Blvd Austin T78721 USA', to: '35 Enoma St. Ilasamaja, Lagos 102214, Lagos, Nigeria', email: 'freviaspieces@amail.com', phone: '08098031206', price: 170300, currency: 'NGN', weight: '300KG' },
    { id: '3', time: '06: 10 am', date: '22-08-25', from: '2001 Ed Bluestein Blvd Austin T78721 USA', to: '35 Enoma St. Ilasamaja, Lagos 102214, Lagos, Nigeria', email: 'freviaspieces@amail.com', phone: '08098031206', price: 170300, currency: 'NGN', weight: '300KG' },
]

export default function RatesCheckPage() {
    const { token } = useAuth()
    const [currentYear, setCurrentYear] = useState(2025)
    const [currentMonthIndex, setCurrentMonthIndex] = useState(8)
    const [selectedDay, setSelectedDay] = useState(29)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [rateEntries] = useState<RateEntry[]>(mockRateEntries)

    useEffect(() => {
        if (!token) return
        setLoading(true)
        setError('')
        setLoading(false)
    }, [token, currentYear, currentMonthIndex])

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

    const handleDayClick = (day: number, isCurrentMonth: boolean) => {
        if (isCurrentMonth) {
            setSelectedDay(day)
            setCalendarOpen(false)
        }
    }

    return (
        <div className="p-4 lg:p-6">
            <AdminPageHeader title="RATE CHECK" backHref="/admin/orders" />

            <CalendarPicker
                currentYear={currentYear}
                currentMonthIndex={currentMonthIndex}
                selectedDay={selectedDay}
                isOpen={calendarOpen}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onDayClick={handleDayClick}
                onToggle={() => setCalendarOpen(!calendarOpen)}
            />

            {error ? (
                <ErrorBanner message={error} variant="red" />
            ) : loading ? (
                <LoadingSpinner className="py-8" />
            ) : (
                <div className="space-y-6 lg:space-y-8">
                    {rateEntries.map((entry) => (
                        <RateEntryCard
                            key={entry.id}
                            time={entry.time}
                            date={entry.date}
                            from={entry.from}
                            to={entry.to}
                            email={entry.email}
                            phone={entry.phone}
                            price={entry.price}
                            currency={entry.currency}
                            weight={entry.weight}
                        />
                    ))}
                </div>
            )}

            {calendarOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setCalendarOpen(false)} />
            )}
        </div>
    )
}
