import { Skeleton } from '@/components/ui/skeleton'

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
    return (
        <div className="space-y-6">
            {Array.from({ length: fields }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            ))}
            <div className="pt-4">
                <Skeleton className="h-12 w-48 rounded-full" />
            </div>
        </div>
    )
}

export function ProfileFormSkeleton() {
    return (
        <div className="flex-1 flex">
            <div className="w-full lg:w-3/5 p-6">
                <div className="space-y-6 max-w-sm">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                    <Skeleton className="h-12 w-full rounded-full" />
                </div>
            </div>
            <div className="hidden lg:flex w-2/5 items-center justify-center p-6">
                <Skeleton className="w-48 h-48 rounded-full" />
            </div>
        </div>
    )
}
