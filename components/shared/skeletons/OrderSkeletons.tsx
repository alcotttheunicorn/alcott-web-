import { Skeleton } from '@/components/ui/skeleton'

export function OrderCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full shrink-0" />
            </div>
        </div>
    )
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <OrderCardSkeleton key={i} />
            ))}
        </div>
    )
}
