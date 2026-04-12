import { Skeleton, PageHeaderSkeleton } from "@/components/dashboard/skeleton";

export default function MediaKitLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeaderSkeleton />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 space-y-4">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
            <Skeleton className="h-5 w-28 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
