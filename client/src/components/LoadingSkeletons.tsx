import { Skeleton } from "@/components/ui/skeleton";

export function GuideCardSkeleton() {
  return (
    <div className="group block bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="w-full h-64" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function CityCardSkeleton() {
  return (
    <div className="group block rounded-2xl overflow-hidden border border-border hover-lift">
      <div className="relative">
        <Skeleton className="w-full h-64" />
      </div>
      <div className="p-6 bg-card space-y-3">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-xl">
          <div className="relative h-80 sm:h-96">
            <Skeleton className="w-full h-full" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-6 sm:p-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Skeleton className="h-6 w-32 mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-6 w-32 mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-28" />
                  </div>
                </div>
              </div>

              <div>
                <Skeleton className="h-7 w-40 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-background border border-border rounded-2xl p-6 shadow-lg space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuideGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <GuideCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CityGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CityCardSkeleton key={i} />
      ))}
    </div>
  );
}
