import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-wide py-16">
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-64 mx-auto mb-4 bg-secondary" />
        <Skeleton className="h-6 w-96 mx-auto bg-secondary" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6">
            <Skeleton className="h-6 w-3/4 mb-4 bg-secondary" />
            <Skeleton className="h-4 w-1/2 mb-6 bg-secondary" />
            <Skeleton className="h-20 w-full mb-4 bg-secondary" />
            <Skeleton className="h-4 w-24 bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}
