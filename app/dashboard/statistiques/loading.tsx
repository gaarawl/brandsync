import { Skeleton, CardSkeleton, PageHeaderSkeleton } from "@/components/dashboard/skeleton";

export default function StatistiquesLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeaderSkeleton />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-52 w-full" />
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-52 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
