'use client'

interface FinanceCardProps {
    amountPaid: number
    paymentMethod: string
    paymentStatus: string
    expenses: number
    profit: number
    currency: string
}

function formatCurrency(amount: number, currency: string) {
    return `${currency} ${amount.toLocaleString()}.00`
}

export function FinanceCard({ amountPaid, paymentMethod, paymentStatus, expenses, profit, currency }: FinanceCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Finance</h3>
                <button className="text-[#4043FF] text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    EDIT
                </button>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Amount paid (Revenue)</span>
                    <span className="text-sm font-semibold text-gray-900">
                        {amountPaid > 0 ? formatCurrency(amountPaid, currency) : 'N/A'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Payment method</span>
                    <span className="text-sm font-semibold text-gray-900">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Payment Status</span>
                    <span className={`text-sm font-semibold ${paymentStatus === 'PAID' ? 'text-green-600' : paymentStatus === 'CANCELLED' ? 'text-red-600' : 'text-gray-900'}`}>
                        {paymentStatus}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Expenses</span>
                    <span className="text-sm font-semibold text-red-500">
                        {expenses !== 0 ? formatCurrency(expenses, currency) : 'N/A'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Profit</span>
                    <span className="text-sm font-semibold text-green-600">
                        {profit > 0 ? formatCurrency(profit, currency) : 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    )
}
