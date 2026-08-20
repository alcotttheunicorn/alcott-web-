import { Skeleton } from '@/components/ui/skeleton'

export function SearchResultSkeleton() {
    return (
        <div className="bg-white rounded-xl border p-4 flex justify-between">
            <div className="flex gap-3">
                <Skeleton className="w-6 h-6 rounded shrink-0" />
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="h-4 w-16 shrink-0" />
        </div>
    )
}

export function SearchResultsSkeleton({ count = 2 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <SearchResultSkeleton key={i} />
            ))}
        </div>
    )
}
