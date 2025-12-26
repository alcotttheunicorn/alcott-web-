'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock order details data
const mockOrderDetails = {
    '1': {
        id: '1',
        charge: 230000,
        currency: 'NGN',
        orderId: null,
        status: 'pending',
        submittedAt: '03 Aug 2025, 09:19 pm',
        processingStart: '04 Aug 2025, 07:19 am',
        processingEnd: '--:--',
        sender: {
            name: 'Dave Kingidon',
            phone: '+2347000467727',
            email: 'Deng22@gmail.com',
            address: 'Stockholm 4 Charles way UK',
        },
        receiver: {
            name: 'Warner Bros',
            email: 'warnerbrosfilm@gmail.com',
            phone: '+2349655630506',
            address: 'Raminglon St. Building Floor 4',
        },
        rider: {
            name: 'Alberdony zaimes',
            vehicle: 'Bus',
            phone: '+2349835952554',
            vehicleInfo: 'Black Toyota agentcar #FBA LAG 222',
        },
        package: {
            description: '4 Boxes of professional music production ram',
            method: 'Single boxing',
            weight: '2.5kg',
            priority: 'High Importance',
        },
        delivery: {
            estDays: 4,
            estDate: '08-08-25',
        },
        finance: {
            amountPaid: 230000,
            paymentMethod: 'Card',
            paymentStatus: 'PAID',
            expenses: -80000,
            profit: 50000,
        },
        eventLog: [],
    },
    '2': {
        id: '2',
        charge: 150000,
        currency: 'NGN',
        orderId: '1679-345898-2367',
        status: 'canceled',
        submittedAt: '02 Aug 2025, 10:00 am',
        processingStart: '--:--',
        processingEnd: '--:--',
        sender: {
            name: 'John Smith',
            phone: '+2348012345678',
            email: 'john@email.com',
            address: 'Lagos, Nigeria',
        },
        receiver: {
            name: 'Jane Doe',
            email: 'jane@email.com',
            phone: '+2348087654321',
            address: 'Abuja, Nigeria',
        },
        rider: {
            name: 'N/A',
            vehicle: 'N/A',
            phone: 'N/A',
            vehicleInfo: 'N/A',
        },
        package: {
            description: 'Electronics package',
            method: 'Double boxing',
            weight: '5kg',
            priority: 'Normal',
        },
        delivery: {
            estDays: 0,
            estDate: 'N/A',
        },
        finance: {
            amountPaid: 0,
            paymentMethod: 'N/A',
            paymentStatus: 'CANCELLED',
            expenses: 0,
            profit: 0,
        },
        eventLog: [],
    },
    '3': {
        id: '3',
        charge: 180000,
        currency: 'NGN',
        orderId: '1622-244898-2365',
        status: 'on_process',
        submittedAt: '01 Aug 2025, 02:30 pm',
        processingStart: '02 Aug 2025, 08:00 am',
        processingEnd: '--:--',
        sender: {
            name: 'Mike Johnson',
            phone: '+2348011111111',
            email: 'mike@email.com',
            address: 'Port Harcourt, Nigeria',
        },
        receiver: {
            name: 'Sarah Williams',
            email: 'sarah@email.com',
            phone: '+2348022222222',
            address: 'Kano, Nigeria',
        },
        rider: {
            name: 'Emmanuel Okoro',
            vehicle: 'Van',
            phone: '+2348099999999',
            vehicleInfo: 'White Toyota Hiace #ABC 123 LAG',
        },
        package: {
            description: 'Furniture items',
            method: 'Crate boxing',
            weight: '15kg',
            priority: 'Medium',
        },
        delivery: {
            estDays: 5,
            estDate: '10-08-25',
        },
        finance: {
            amountPaid: 180000,
            paymentMethod: 'Wallet',
            paymentStatus: 'PAID',
            expenses: -60000,
            profit: 40000,
        },
        eventLog: [],
    },
    '4': {
        id: '4',
        charge: 95000,
        currency: 'NGN',
        orderId: '1244-244898-2595',
        status: 'initiated',
        submittedAt: '05 Aug 2025, 11:00 am',
        processingStart: '--:--',
        processingEnd: '--:--',
        sender: {
            name: 'Peter Parker',
            phone: '+2348033333333',
            email: 'peter@email.com',
            address: 'Ibadan, Nigeria',
        },
        receiver: {
            name: 'Mary Jane',
            email: 'mj@email.com',
            phone: '+2348044444444',
            address: 'Enugu, Nigeria',
        },
        rider: {
            name: 'Pending assignment',
            vehicle: 'N/A',
            phone: 'N/A',
            vehicleInfo: 'N/A',
        },
        package: {
            description: 'Documents and files',
            method: 'Envelope',
            weight: '0.5kg',
            priority: 'Low',
        },
        delivery: {
            estDays: 3,
            estDate: '12-08-25',
        },
        finance: {
            amountPaid: 95000,
            paymentMethod: 'Card',
            paymentStatus: 'PAID',
            expenses: 0,
            profit: 0,
        },
        eventLog: [],
    },
    '5': {
        id: '5',
        charge: 120000,
        currency: 'NGN',
        orderId: '1644-299456-2075',
        status: 'delivered',
        submittedAt: '28 Jul 2025, 09:00 am',
        processingStart: '28 Jul 2025, 11:00 am',
        processingEnd: '30 Jul 2025, 03:00 pm',
        sender: {
            name: 'Bruce Wayne',
            phone: '+2348055555555',
            email: 'bruce@email.com',
            address: 'Calabar, Nigeria',
        },
        receiver: {
            name: 'Clark Kent',
            email: 'clark@email.com',
            phone: '+2348066666666',
            address: 'Jos, Nigeria',
        },
        rider: {
            name: 'Chinedu Obi',
            vehicle: 'Motorcycle',
            phone: '+2348088888888',
            vehicleInfo: 'Honda CG #XYZ 789 LAG',
        },
        package: {
            description: 'Clothing items',
            method: 'Soft packaging',
            weight: '3kg',
            priority: 'Normal',
        },
        delivery: {
            estDays: 2,
            estDate: '30-07-25',
        },
        finance: {
            amountPaid: 120000,
            paymentMethod: 'Wallet',
            paymentStatus: 'PAID',
            expenses: -30000,
            profit: 35000,
        },
        eventLog: [
            { event: 'Order delivered', time: '30 Jul 2025, 03:00 pm' },
        ],
    },
}

function StatusBadge({ status }: { status: string }) {
    const getStatusStyles = () => {
        switch (status) {
            case 'on_process':
                return 'bg-blue-100 text-blue-600'
            case 'delivered':
                return 'bg-green-100 text-green-600'
            case 'canceled':
                return 'bg-red-100 text-red-600'
            case 'initiated':
                return 'bg-purple-100 text-purple-600'
            case 'pending':
                return 'bg-yellow-100 text-yellow-600'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusStyles()}`}>
            {status.replace('_', ' ')}
        </span>
    )
}

function formatCurrency(amount: number, currency: string) {
    return `${currency} ${amount.toLocaleString()}.00`
}

export default function OrderDetailsPage() {
    const params = useParams()
    const orderId = params.id as string
    const order = mockOrderDetails[orderId as keyof typeof mockOrderDetails]

    if (!order) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
                    <Link href="/admin/orders" className="text-[#4043FF] hover:underline">
                        Back to Orders
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/orders" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">ORDERS DETAILS</h1>
                </div>
                <button className="text-[#4043FF] text-sm font-semibold flex items-center gap-1 hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    EDIT
                </button>
            </div>

            <div className="flex gap-6">
                {/* Left Column - Order Info */}
                <div className="flex-1 space-y-6">
                    {/* Top Info Bar */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Charge</p>
                                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    {formatCurrency(order.charge, order.currency)}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Order id</p>
                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    {order.orderId || 'N/A'}
                                    {order.orderId && (
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <StatusBadge status={order.status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mt-4 pt-4 border-t border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Submitted</p>
                                <p className="text-sm font-semibold text-gray-900">{order.submittedAt}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Processing Start</p>
                                <p className="text-sm font-semibold text-gray-900">{order.processingStart}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Processing End</p>
                                <p className="text-sm font-semibold text-gray-900">{order.processingEnd}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sender Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Sender name</p>
                            <p className="text-sm font-semibold text-gray-900">{order.sender.name}</p>
                        </div>
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Sender Phone</p>
                            <p className="text-sm font-semibold text-gray-900">{order.sender.phone}</p>
                        </div>
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Sender email</p>
                            <p className="text-sm font-semibold text-gray-900">{order.sender.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Sender Address</p>
                            <p className="text-sm font-semibold text-gray-900">{order.sender.address}</p>
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Receiver name</p>
                            <p className="text-sm font-semibold text-gray-900">{order.receiver.name}</p>
                        </div>
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Receiver email</p>
                            <p className="text-sm font-semibold text-gray-900">{order.receiver.email}</p>
                        </div>
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Receiver Phone</p>
                            <p className="text-sm font-semibold text-gray-900">{order.receiver.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Receiver Address</p>
                            <p className="text-sm font-semibold text-gray-900">{order.receiver.address}</p>
                        </div>
                    </div>

                    {/* Rider Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Rider name</p>
                            <p className="text-sm font-semibold text-gray-900">{order.rider.name}</p>
                        </div>
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Rider vehicle</p>
                            <p className="text-sm font-semibold text-gray-900">{order.rider.vehicle}</p>
                        </div>
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Receiver Phone</p>
                            <p className="text-sm font-semibold text-gray-900">{order.rider.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Vehicle info</p>
                            <p className="text-sm font-semibold text-gray-900">{order.rider.vehicleInfo}</p>
                        </div>
                    </div>

                    {/* Package Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Package description</p>
                            <p className="text-sm font-semibold text-gray-900">{order.package.description}</p>
                        </div>
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Packaging method</p>
                            <p className="text-sm font-semibold text-gray-900">{order.package.method}</p>
                        </div>
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs text-gray-500">Package Weight</p>
                            <p className="text-sm font-semibold text-gray-900">{order.package.weight}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Package priority</p>
                            <p className="text-sm font-semibold text-gray-900">{order.package.priority}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Actions & Summary */}
                <div className="w-80 space-y-6">
                    {/* Actions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Close Order</span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Cancel Order</span>
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Delivery */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-900">Delivery</h3>
                            <button className="text-[#4043FF] text-xs font-semibold flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                EDIT
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Est. Days</span>
                                <span className="text-sm font-semibold text-gray-900">{order.delivery.estDays || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Est. Date</span>
                                <span className="text-sm font-semibold text-gray-900">{order.delivery.estDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Event Log */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-900">Event Log</h3>
                            <button className="text-green-600 text-xs font-semibold flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Event
                            </button>
                        </div>
                        {order.eventLog.length > 0 ? (
                            <div className="space-y-2">
                                {order.eventLog.map((log, i) => (
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

                    {/* Finance */}
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
                                    {order.finance.amountPaid > 0 ? formatCurrency(order.finance.amountPaid, order.currency) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Payment method</span>
                                <span className="text-sm font-semibold text-gray-900">{order.finance.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Payment Status</span>
                                <span className={`text-sm font-semibold ${order.finance.paymentStatus === 'PAID' ? 'text-green-600' : order.finance.paymentStatus === 'CANCELLED' ? 'text-red-600' : 'text-gray-900'}`}>
                                    {order.finance.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Expenses</span>
                                <span className="text-sm font-semibold text-red-500">
                                    {order.finance.expenses !== 0 ? formatCurrency(order.finance.expenses, order.currency) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Profit</span>
                                <span className="text-sm font-semibold text-green-600">
                                    {order.finance.profit > 0 ? formatCurrency(order.finance.profit, order.currency) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
