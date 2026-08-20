'use client'

interface CalendarPickerProps {
    currentYear: number
    currentMonthIndex: number
    selectedDay: number
    isOpen: boolean
    onPrevMonth: () => void
    onNextMonth: () => void
    onDayClick: (day: number, isCurrentMonth: boolean) => void
    onToggle: () => void
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay()
}

export function CalendarPicker({ currentYear, currentMonthIndex, selectedDay, isOpen, onPrevMonth, onNextMonth, onDayClick, onToggle }: CalendarPickerProps) {
    const currentMonth = `${MONTHS[currentMonthIndex].toUpperCase()} ${currentYear}`
    const calendarMonth = `${MONTHS[currentMonthIndex]} ${currentYear}`

    const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthIndex)
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonthIndex - 1)

    const calendarDays: { day: number; isCurrentMonth: boolean }[] = []
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false })
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, isCurrentMonth: true })
    }
    const remainingCells = 42 - calendarDays.length
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays.push({ day: i, isCurrentMonth: false })
    }

    return (
        <div className="relative flex items-center gap-2 mb-6 lg:mb-8">
            <button onClick={onPrevMonth} className="text-[#4043FF] hover:text-[#3333CC] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button onClick={onToggle} className="text-[#4043FF] font-semibold text-sm hover:underline">
                {currentMonth}
            </button>
            <button onClick={onNextMonth} className="text-[#4043FF] hover:text-[#3333CC] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-64">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Calendar</h3>
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={onPrevMonth} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-[#4043FF] font-semibold text-sm">{calendarMonth}</span>
                        <button onClick={onNextMonth} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {DAYS.map((day, index) => (
                            <div key={index} className="text-center text-xs font-medium text-gray-400 py-1">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.slice(0, 35).map((item, index) => (
                            <button
                                key={index}
                                onClick={() => onDayClick(item.day, item.isCurrentMonth)}
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
    )
}
