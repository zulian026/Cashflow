import AppLayout from "@/components/layout/AppLayout";
import PageSkeleton from "@/components/skeleton/PageSkeleton";

export default function Loading() {
  return (
    <AppLayout>
      <PageSkeleton />
    </AppLayout>
  );
}
