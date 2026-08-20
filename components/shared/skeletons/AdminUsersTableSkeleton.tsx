import { Skeleton } from '@/components/ui/skeleton'

export function AdminUsersTableSkeleton() {
    return (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
            <Skeleton className="h-5 w-24 mx-auto mb-4" />

            <div className="border-b border-gray-200 pb-3 mb-1">
                <div className="flex justify-between px-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>

            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 px-4 border-b border-gray-100">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3.5 w-24" />
                </div>
            ))}

            <div className="flex items-center justify-end gap-2 mt-4">
                <Skeleton className="h-4 w-16" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="w-6 h-6 rounded" />
                ))}
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    )
}
