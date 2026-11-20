import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder matching FoodCard's shape, for grid queries. */
export function FoodCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border/40">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-end justify-between pt-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function FoodGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </div>
  );
}
