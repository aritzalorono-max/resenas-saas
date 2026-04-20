export default function ResenasLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-7 bg-gray-200 rounded-lg w-56 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-48" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-100 rounded-full w-20" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-3 bg-gray-100 rounded w-28" />
                <div className="h-10 bg-gray-50 rounded-lg w-full mt-3" />
                <div className="flex gap-4 mt-2">
                  <div className="h-3 bg-gray-100 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
              </div>
              <div className="h-6 bg-gray-100 rounded-full w-20 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
