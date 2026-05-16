export default function CartelLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <div className="h-7 bg-gray-200 rounded-lg w-56 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-64" />
        </div>
        <div className="h-11 bg-gray-200 rounded-xl w-48" />
      </div>

      {/* Tab selector skeleton */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 bg-gray-100 rounded-lg w-32" />
        ))}
      </div>

      {/* Poster card skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md mx-auto w-full max-w-sm overflow-hidden">
        <div className="bg-gray-200 h-48" />
        <div className="p-8 space-y-4">
          <div className="h-4 bg-gray-100 rounded w-48 mx-auto" />
          <div className="w-52 h-52 bg-gray-100 rounded-2xl mx-auto" />
          <div className="h-3 bg-gray-50 rounded w-40 mx-auto" />
          <div className="border-t border-gray-100 pt-4">
            <div className="h-4 bg-gray-100 rounded w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
