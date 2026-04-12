import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-bg-elevated",
        className
      )}
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border-subtle bg-bg-surface p-5", className)}>
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border-subtle">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <Skeleton className="h-4 flex-1 max-w-[200px]" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
      <div>
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-32 rounded-lg" />
    </div>
  );
}
