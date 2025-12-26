'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NewUser {
    id: string
    name: string
    joinedText: string
    email: string
    phone: string
}

interface UserListItem {
    id: string
    name: string
    email: string
    phone: string
}

const mockNewUsers: NewUser[] = [
    { id: '1', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
    { id: '2', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
    { id: '3', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
    { id: '4', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
    { id: '5', name: 'John Doe', joinedText: 'Joined Today', email: 'john022@gmail.com', phone: '+234 734 435 3456' },
]

const mockUsersList: UserListItem[] = [
    { id: '1', name: 'John Doesky', email: 'Jodesky2@Gmail.Com', phone: '+234 705 568 3456' },
    { id: '2', name: 'John Doesky', email: 'Jodesky2@Gmail.Com', phone: '+234 705 568 3456' },
    { id: '3', name: 'John Doesky', email: 'Jodesky2@Gmail.Com', phone: '+234 705 568 3456' },
    { id: '4', name: 'John Doesky', email: 'Jodesky2@Gmail.Com', phone: '+234 705 568 3456' },
]

export default function UsersPage() {
    const [searchValue, setSearchValue] = useState('')
    const [selectedReportYear, setSelectedReportYear] = useState('last_year')
    const [currentPage, setCurrentPage] = useState(1)

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/orders" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-900">USERS</h1>
            </div>

            <div className="flex gap-6">
                {/* Left Column */}
                <div className="w-[360px] space-y-4">
                    {/* User Details Card */}
                    <div className="rounded-xl overflow-hidden">
                        {/* Top section - light purple gradient */}
                        <div className="bg-gradient-to-b from-[#E8E9FF] to-[#D4D6FF] p-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-gray-900 font-bold text-lg">User Details</h2>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Enter User Name"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 w-44"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                                    <span className="text-3xl font-bold text-[#1a1a2e]">J</span>
                                </div>
                                <div className="text-gray-700 text-sm space-y-1.5">
                                    <p><span className="font-semibold text-gray-900">Name:</span> John Doe</p>
                                    <p><span className="font-semibold text-gray-900">Email:</span> johndoe33@gmail.com</p>
                                    <p><span className="font-semibold text-gray-900">Tel. No:</span> +234 705 483 1845</p>
                                    <p><span className="font-semibold text-gray-900">Join Date:</span> October-24-2024</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom section - slightly darker */}
                        <div className="bg-[#C8CAEE] px-4 py-3 flex items-center justify-between">
                            <span className="text-gray-800 text-sm font-medium">Last Order Date: 20-09-25</span>
                            <button className="bg-[#4043FF] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#3333CC] transition-colors">
                                View Order
                            </button>
                        </div>
                    </div>
                    {/* New Users This Month */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">NEW USERS THIS MONTH</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">5</span>
                        </div>

                        <div className="space-y-3">
                            {mockNewUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.joinedText}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-600">{user.email}</p>
                                        <p className="text-xs text-gray-500">{user.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 space-y-4">
                    {/* Stats Cards Row */}
                    <div className="flex gap-4">
                        {/* Total User Card */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total User</p>
                                    <p className="text-3xl font-bold text-gray-900">800</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7 14l5-5 5 5z" />
                                        </svg>
                                        <span className="text-xs text-green-500 font-semibold">8.5%</span>
                                        <span className="text-xs text-gray-500">This Year</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#E8E9FF] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Monthly User Card */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Monthly User</p>
                                    <p className="text-3xl font-bold text-gray-900">10</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7 14l5-5 5 5z" />
                                        </svg>
                                        <span className="text-xs text-green-500 font-semibold">2.5%</span>
                                        <select className="text-xs text-gray-500 bg-transparent border-none p-0 focus:ring-0">
                                            <option>This Month</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#E8E9FF] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#4043FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Chart */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">User Chart</h3>
                        <div className="relative h-40">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400">
                                <span>80</span>
                                <span>60</span>
                                <span>40</span>
                                <span>20</span>
                                <span>0</span>
                            </div>
                            {/* Chart area */}
                            <div className="ml-8 h-full relative">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between">
                                    <div className="border-t border-gray-100"></div>
                                    <div className="border-t border-gray-100"></div>
                                    <div className="border-t border-gray-100"></div>
                                    <div className="border-t border-gray-100"></div>
                                    <div className="border-t border-gray-100"></div>
                                </div>
                                {/* Line chart SVG */}
                                <svg className="w-full h-[calc(100%-24px)]" viewBox="0 0 300 100" preserveAspectRatio="none">
                                    <polyline
                                        fill="none"
                                        stroke="#4043FF"
                                        strokeWidth="2"
                                        points="0,80 50,60 100,70 150,30 200,50 250,20 300,40"
                                    />
                                </svg>
                                {/* X-axis labels */}
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>Mar</span>
                                    <span>Apr</span>
                                    <span>May</span>
                                    <span>Jun</span>
                                    <span>Jul</span>
                                    <span>Aug</span>
                                    <span>Sept</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Reports Row */}
                    <div className="flex gap-4">
                        {/* User Reports */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-900">User Reports</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Select Year</p>
                            <div className="flex items-center gap-4 mb-3">
                                <label className="flex items-center gap-1.5">
                                    <input
                                        type="radio"
                                        name="reportYear"
                                        value="this_year"
                                        checked={selectedReportYear === 'this_year'}
                                        onChange={(e) => setSelectedReportYear(e.target.value)}
                                        className="w-3 h-3 text-[#4043FF]"
                                    />
                                    <span className="text-xs text-gray-600">This Year</span>
                                </label>
                                <label className="flex items-center gap-1.5">
                                    <input
                                        type="radio"
                                        name="reportYear"
                                        value="last_year"
                                        checked={selectedReportYear === 'last_year'}
                                        onChange={(e) => setSelectedReportYear(e.target.value)}
                                        className="w-3 h-3 text-[#4043FF]"
                                    />
                                    <span className="text-xs text-gray-600">Last Year</span>
                                </label>
                                <label className="flex items-center gap-1.5">
                                    <input
                                        type="radio"
                                        name="reportYear"
                                        value="2_years_ago"
                                        checked={selectedReportYear === '2_years_ago'}
                                        onChange={(e) => setSelectedReportYear(e.target.value)}
                                        className="w-3 h-3 text-[#4043FF]"
                                    />
                                    <span className="text-xs text-gray-600">2 Years Ago</span>
                                </label>
                            </div>
                            <button className="bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                Download User Reports (CSV)
                            </button>
                        </div>

                        {/* Active Users */}
                        <div className="w-40 bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Active Users</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">13</span>
                                <span className="text-xs text-green-500 font-semibold">+20%</span>
                            </div>
                            {/* Mini chart */}
                            <svg className="w-full h-8 mt-2" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <polyline
                                    fill="none"
                                    stroke="#EF4444"
                                    strokeWidth="2"
                                    points="0,25 20,20 40,15 60,18 80,10 100,5"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users List Table */}
            <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Users List</h3>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left text-sm font-bold text-gray-900 pb-3 pl-4">Name</th>
                            <th className="text-center text-sm font-bold text-gray-900 pb-3">Email</th>
                            <th className="text-right text-sm font-bold text-gray-900 pb-3 pr-4">Tel. No</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockUsersList.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100">
                                <td className="text-left text-sm text-gray-700 py-3 pl-4">{user.name}</td>
                                <td className="text-center text-sm text-gray-700 py-3">{user.email}</td>
                                <td className="text-right text-sm text-gray-700 py-3 pr-4">{user.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 mt-4">
                    <button className="text-[#4043FF] text-sm font-semibold hover:underline">&lt; Previous</button>
                    <button className={`w-6 h-6 rounded text-sm font-semibold ${currentPage === 1 ? 'bg-[#4043FF] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>1</button>
                    <button className={`w-6 h-6 rounded text-sm font-semibold ${currentPage === 2 ? 'bg-[#4043FF] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>2</button>
                    <button className={`w-6 h-6 rounded text-sm font-semibold ${currentPage === 3 ? 'bg-[#4043FF] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>3</button>
                    <button className={`w-6 h-6 rounded text-sm font-semibold ${currentPage === 4 ? 'bg-[#4043FF] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>4</button>
                    <button className="text-[#4043FF] text-sm font-semibold hover:underline">Next &gt;</button>
                </div>
            </div>
        </div>
    )
}
