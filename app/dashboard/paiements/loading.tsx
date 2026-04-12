import { Skeleton, PageHeaderSkeleton, TableRowSkeleton } from "@/components/dashboard/skeleton";

export default function PaiementsLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeaderSkeleton />
      <div className="p-6">
        <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-border-subtle flex gap-3">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
