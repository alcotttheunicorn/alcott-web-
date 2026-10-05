import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = 'No items found',
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <p className="text-gray-900 font-semibold mb-1">
        {title}
      </p>
      {description && (
        <p className="text-sm text-gray-500 mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
