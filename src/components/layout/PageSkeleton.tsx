

export function PageSkeleton() {
  return (
    <div className="w-full h-full min-h-[80vh] p-4 sm:p-6 md:p-8 space-y-6 flex flex-col animate-pulse">
      {/* Header/Rubrik Skeleton */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="h-10 w-1/3 bg-white/10 rounded-lg border border-white/5 shadow-sm backdrop-blur-sm"></div>
        <div className="h-10 w-10 bg-white/10 rounded-full border border-white/5 shadow-sm backdrop-blur-sm hidden sm:block"></div>
      </div>

      {/* Hero / Huvudblock Skeleton */}
      <div className="w-full h-48 sm:h-64 bg-white/5 rounded-2xl border border-white/10 shadow-md backdrop-blur-md"></div>

      {/* Innehållsblock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="h-32 bg-white/5 rounded-xl border border-white/5 shadow-sm backdrop-blur-sm"></div>
        <div className="h-32 bg-white/5 rounded-xl border border-white/5 shadow-sm backdrop-blur-sm"></div>
        <div className="h-32 bg-white/5 rounded-xl border border-white/5 shadow-sm backdrop-blur-sm"></div>
        <div className="h-32 bg-white/5 rounded-xl border border-white/5 shadow-sm backdrop-blur-sm"></div>
      </div>
    </div>
  );
}
