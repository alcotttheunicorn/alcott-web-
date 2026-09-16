import { Skeleton } from '@/components/ui/skeleton'

export function AdminListRowSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-2/5 max-w-xs" />
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-3/4 max-w-lg" />
            </div>
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
        </div>
    )
}

export function AdminListSkeleton({ count = 6, className = '' }: { count?: number; className?: string }) {
    return (
        <div className={`space-y-6 lg:space-y-8 pl-2 lg:pl-6 pr-2 lg:pr-8 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <AdminListRowSkeleton key={i} />
            ))}
        </div>
    )
}
