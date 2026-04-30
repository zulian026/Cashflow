import SkeletonCard from "./SkeletonCard";
import SkeletonTable from "./SkeletonTable";

export default function PageSkeleton() {
  return (
    <main className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <SkeletonTable />
    </main>
  );
}
