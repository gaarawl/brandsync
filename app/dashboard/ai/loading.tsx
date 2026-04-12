import { Skeleton, PageHeaderSkeleton } from "@/components/dashboard/skeleton";

export default function AILoading() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeaderSkeleton />
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1 rounded-xl border border-border-subtle bg-bg-surface p-5 flex flex-col">
          <div className="flex-1 space-y-4 mb-4">
            <Skeleton className="h-12 w-3/4 rounded-xl" />
            <Skeleton className="h-12 w-1/2 rounded-xl ml-auto" />
            <Skeleton className="h-12 w-2/3 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
