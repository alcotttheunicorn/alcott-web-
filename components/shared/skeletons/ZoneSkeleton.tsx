import { Skeleton } from '@/components/ui/skeleton'

export function ZoneCardSkeleton() {
    return (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <Skeleton className="h-4 w-28" />
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        </div>
    )
}

export function ZoneGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ZoneCardSkeleton key={i} />
            ))}
        </div>
    )
}
