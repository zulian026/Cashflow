export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[28px] p-6 border border-slate-100 animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded-full mb-4" />
      <div className="h-8 w-40 bg-slate-200 rounded-full mb-6" />
      <div className="h-20 bg-slate-100 rounded-2xl" />
    </div>
  );
}