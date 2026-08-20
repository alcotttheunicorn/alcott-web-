'use client'

export function UserChart() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4">User Chart</h3>
            <div className="relative h-40">
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400">
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                    <span>0</span>
                </div>
                <div className="ml-8 h-full relative">
                    <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="border-t border-gray-100"></div>
                        <div className="border-t border-gray-100"></div>
                        <div className="border-t border-gray-100"></div>
                        <div className="border-t border-gray-100"></div>
                        <div className="border-t border-gray-100"></div>
                    </div>
                    <svg className="w-full h-[calc(100%-24px)]" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <polyline
                            fill="none"
                            stroke="#4043FF"
                            strokeWidth="2"
                            points="0,80 50,60 100,70 150,30 200,50 250,20 300,40"
                        />
                    </svg>
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
    )
}
