import { Skeleton, PageHeaderSkeleton } from "@/components/dashboard/skeleton";

export default function CalendrierLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeaderSkeleton />
      <div className="p-6">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {/* Calendar grid skeleton */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={`h-${i}`} className="h-8" />
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
