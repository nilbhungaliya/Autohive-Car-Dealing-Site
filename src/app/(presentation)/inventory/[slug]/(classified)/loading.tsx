import { CarouselSkeleton } from "@/components/classified/carousel-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassifiedLoading() {
  return (
    <div className="flex flex-col container mx-auto px-4 md:px-0 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <CarouselSkeleton />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Skeleton className="w-20 h-20 rounded" />
            <Skeleton className="h-8 w-48 rounded" />
          </div>
          <div className="flex gap-2 mt-4 mb-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-24 w-full rounded-xl my-4" />
          <Skeleton className="h-12 w-full rounded mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-xs p-4 text-center flex items-center flex-col">
                <Skeleton className="h-6 w-6 mx-auto rounded-full" />
                <Skeleton className="h-4 w-16 mt-2 mx-auto rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
