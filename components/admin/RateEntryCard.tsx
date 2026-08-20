'use client'

interface RateEntryCardProps {
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

export function RateEntryCard({ time, date, from, to, email, phone, price, currency, weight }: RateEntryCardProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="space-y-1 flex-1 min-w-0">
                <p className="text-base lg:text-lg font-bold text-gray-900">
                    {time}  {date}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 wrap-break-word">
                    <span className="font-semibold">From:</span> {from}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 wrap-break-word">
                    <span className="font-semibold">To:</span> {to}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 wrap-break-word">
                    <span className="font-semibold">By:</span> {email}, {phone}
                </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
                <p className="text-base lg:text-lg font-bold text-gray-900">
                    {currency} {price.toLocaleString()}.00
                </p>
                <p className="text-xs lg:text-sm font-semibold text-gray-700">{weight}</p>
            </div>
        </div>
    )
}
