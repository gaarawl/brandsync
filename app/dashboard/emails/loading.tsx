import { Skeleton, PageHeaderSkeleton, TableRowSkeleton } from "@/components/dashboard/skeleton";

export default function EmailsLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeaderSkeleton />
      <div className="p-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-border-subtle">
            <Skeleton className="h-9 w-64 rounded-lg" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
