'use client'

interface EventLog {
    event: string
    time: string
}

interface EventLogCardProps {
    events: EventLog[]
    onNewEvent?: () => void
}

export function EventLogCard({ events, onNewEvent }: EventLogCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Event Log</h3>
                {onNewEvent && (
                    <button onClick={onNewEvent} className="text-green-600 text-xs font-semibold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Event
                    </button>
                )}
            </div>
            {events.length > 0 ? (
                <div className="space-y-2">
                    {events.map((log, i) => (
                        <div key={i} className="text-sm text-gray-600">
                            <p className="font-medium">{log.event}</p>
                            <p className="text-xs text-gray-400">{log.time}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm text-gray-500">No event for this order yet</p>
                </div>
            )}
        </div>
    )
}
