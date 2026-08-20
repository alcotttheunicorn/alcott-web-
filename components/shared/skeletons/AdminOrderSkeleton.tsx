import { Skeleton } from '@/components/ui/skeleton'

export function AdminOrderCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 lg:gap-4">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-28" />
                </div>
            </div>
            <Skeleton className="h-9 w-24 rounded-lg shrink-0" />
        </div>
    )
}

export function AdminOrderListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3 lg:space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <AdminOrderCardSkeleton key={i} />
            ))}
        </div>
    )
}
