import { Skeleton } from '@/components/ui/skeleton'

export function BalanceSkeleton() {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-200">
            <div className="absolute inset-0 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20 bg-gray-300" />
                    <Skeleton className="h-8 w-40 bg-gray-300" />
                    <Skeleton className="h-8 w-24 rounded-full bg-gray-300" />
                </div>
                <div className="hidden sm:block text-right space-y-2">
                    <Skeleton className="h-3 w-28 bg-gray-300 ml-auto" />
                    <Skeleton className="h-6 w-36 bg-gray-300 ml-auto" />
                </div>
            </div>
        </div>
    )
}

export function TransactionCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
            <Skeleton className="h-3 w-16 shrink-0 ml-2 mt-1" />
        </div>
    )
}

export function TransactionHistorySkeleton() {
    return (
        <div className="space-y-3 lg:space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <TransactionCardSkeleton key={i} />
            ))}
        </div>
    )
}
