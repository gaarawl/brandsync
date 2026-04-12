import { Skeleton, PageHeaderSkeleton } from "@/components/dashboard/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeaderSkeleton />
      <div className="p-6 space-y-6">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
