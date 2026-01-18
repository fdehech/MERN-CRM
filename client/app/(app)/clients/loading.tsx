export default function Loading() {
  return (
    <div className="p-8 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>

      {/* Search and filters skeleton */}
      <div className="space-y-4 bg-card p-6 rounded-lg border border-border">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-card p-6 rounded-lg border border-border space-y-3">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
