'use client'

type OrderStatus = 'all' | 'pending' | 'on_process' | 'delivered'

interface StatusFilterTabsProps {
    activeTab: OrderStatus
    onTabChange: (tab: OrderStatus) => void
}

const statusTabs: { key: OrderStatus; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'pending', label: 'PENDING' },
    { key: 'on_process', label: 'ON PROCESS' },
    { key: 'delivered', label: 'DELIVERED' },
]

export function StatusFilterTabs({ activeTab, onTabChange }: StatusFilterTabsProps) {
    return (
        <div className="flex flex-wrap gap-2 lg:gap-3 mb-4 lg:mb-6">
            {statusTabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-semibold text-xs lg:text-sm transition-colors whitespace-nowrap ${activeTab === tab.key
                        ? 'bg-[#4043FF] text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:border-[#4043FF] hover:text-[#4043FF]'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
