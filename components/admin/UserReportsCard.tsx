'use client'

interface UserReportsCardProps {
    selectedYear: string
    onYearChange: (value: string) => void
}

export function UserReportsCard({ selectedYear, onYearChange }: UserReportsCardProps) {
    return (
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
                        checked={selectedYear === 'this_year'}
                        onChange={(e) => onYearChange(e.target.value)}
                        className="w-3 h-3 text-[#4043FF]"
                    />
                    <span className="text-xs text-gray-600">This Year</span>
                </label>
                <label className="flex items-center gap-1.5">
                    <input
                        type="radio"
                        name="reportYear"
                        value="last_year"
                        checked={selectedYear === 'last_year'}
                        onChange={(e) => onYearChange(e.target.value)}
                        className="w-3 h-3 text-[#4043FF]"
                    />
                    <span className="text-xs text-gray-600">Last Year</span>
                </label>
                <label className="flex items-center gap-1.5">
                    <input
                        type="radio"
                        name="reportYear"
                        value="2_years_ago"
                        checked={selectedYear === '2_years_ago'}
                        onChange={(e) => onYearChange(e.target.value)}
                        className="w-3 h-3 text-[#4043FF]"
                    />
                    <span className="text-xs text-gray-600">2 Years Ago</span>
                </label>
            </div>
            <button className="bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                Download User Reports (CSV)
            </button>
        </div>
    )
}
