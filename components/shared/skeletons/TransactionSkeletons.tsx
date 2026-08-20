import { Skeleton } from '@/components/ui/skeleton'

export function TransactionRowSkeleton() {
    return (
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1.5 min-w-0">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
            <Skeleton className="h-3 w-16 shrink-0 ml-3" />
        </div>
    )
}

export function TransactionListSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="space-y-0">
            {Array.from({ length: count }).map((_, i) => (
                <TransactionRowSkeleton key={i} />
            ))}
        </div>
    )
}
