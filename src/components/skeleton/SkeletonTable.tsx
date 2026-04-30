export default function SkeletonTable() {
  return (
    <div className="bg-white rounded-[28px] p-6 border border-slate-100 animate-pulse">
      <div className="h-6 w-40 bg-slate-200 rounded mb-6" />

      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-slate-100 rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}