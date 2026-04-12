import { Skeleton, CardSkeleton } from "@/components/dashboard/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-bg-surface p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
            <Skeleton className="h-5 w-28 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
