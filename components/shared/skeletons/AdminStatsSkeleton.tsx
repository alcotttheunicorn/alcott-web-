import { Skeleton } from '@/components/ui/skeleton'

export function StatCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-2.5 w-24" />
        </div>
    )
}

export function StatCardsSkeleton() {
    return (
        <div className="flex gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
        </div>
    )
}

export function UserDetailsCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <Skeleton className="h-4 w-28" />
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
            </div>
        </div>
    )
}

export function ActiveUsersCardSkeleton() {
    return (
        <div className="w-40 bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-8 w-full" />
        </div>
    )
}
