export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Title skeleton */}
      <div className="mb-6 lg:mb-8">
        <div className="h-7 bg-gray-200 rounded-lg w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-36" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 h-28" />
        ))}
      </div>

      {/* Distribution bar skeleton */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 h-32">
        <div className="h-3 bg-gray-100 rounded w-40 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <div className="h-3 bg-gray-100 rounded w-20" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full" />
            <div className="h-3 bg-gray-100 rounded w-8" />
          </div>
        ))}
      </div>

      {/* CTA skeleton */}
      <div className="bg-gray-200 rounded-2xl h-20 mb-6" />

      {/* Recent list skeleton */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100">
          <div className="h-4 bg-gray-100 rounded w-36" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 border-b border-gray-50 flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-32" />
              <div className="h-3 bg-gray-50 rounded w-24" />
            </div>
            <div className="h-5 bg-gray-100 rounded-full w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
