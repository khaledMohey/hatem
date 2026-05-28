export function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-1/3 skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-5 w-1/4 skeleton rounded mt-3" />
      </div>
    </div>
  );
}
