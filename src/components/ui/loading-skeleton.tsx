import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  variant?: "card" | "text" | "avatar" | "chart"
  className?: string
}

export function LoadingSkeleton({ variant = "card", className }: LoadingSkeletonProps) {
  switch (variant) {
    case "card":
      return (
        <div className={cn("space-y-3 p-4", className)}>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      )
    
    case "text":
      return (
        <div className={cn("space-y-2", className)}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      )
    
    case "avatar":
      return (
        <div className={cn("flex items-center space-x-3", className)}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      )
    
    case "chart":
      return (
        <div className={cn("space-y-4", className)}>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-48 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      )
    
    default:
      return <Skeleton className={className} />
  }
}