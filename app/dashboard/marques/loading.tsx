import { Skeleton, PageHeaderSkeleton, CardSkeleton } from "@/components/dashboard/skeleton";

export default function MarquesLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeaderSkeleton />
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border-subtle bg-bg-surface p-5">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
