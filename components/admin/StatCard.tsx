import React from 'react'

interface StatCardProps {
    title: string;
    value: string | number;
    trendValue?: string;
    trendLabel?: React.ReactNode;
    trendPositive?: boolean;
    icon: React.ReactNode;
}

export function StatCard({
    title,
    value,
    trendValue,
    trendLabel,
    trendPositive = true,
    icon
}: StatCardProps) {
    return (
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {(trendValue || trendLabel) && (
                        <div className="flex items-center gap-1 mt-2">
                            {trendValue && (
                                <>
                                    <svg
                                        className={`w-3 h-3 ${trendPositive ? 'text-green-500' : 'text-red-500 transform rotate-180'}`}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M7 14l5-5 5 5z" />
                                    </svg>
                                    <span className={`text-xs font-semibold ${trendPositive ? 'text-green-500' : 'text-red-500'}`}>
                                        {trendValue}
                                    </span>
                                </>
                            )}
                            {trendLabel && (
                                <span className="text-xs text-gray-500">
                                    {trendLabel}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="w-10 h-10 rounded-full bg-[#E8E9FF] flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    )
}
