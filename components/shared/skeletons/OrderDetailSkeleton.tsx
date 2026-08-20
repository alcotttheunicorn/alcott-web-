import { Skeleton } from '@/components/ui/skeleton'

function DetailCardSkeleton({ rows = 4 }: { rows?: number }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="space-y-2">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function OrderDetailSkeleton() {
    return (
        <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-36" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <DetailCardSkeleton rows={4} />
            <DetailCardSkeleton rows={4} />
            <DetailCardSkeleton rows={5} />
        </div>
    )
}
