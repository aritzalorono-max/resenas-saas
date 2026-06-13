export default function IncentivosLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-7 bg-gray-200 rounded-lg w-36 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-72" />
      </div>

      {/* Toggle card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <div className="h-5 bg-gray-200 rounded w-40 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-64" />
        </div>
        <div className="h-7 w-12 bg-gray-200 rounded-full shrink-0" />
      </div>

      {/* Config card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-gray-100 rounded w-28 mb-2" />
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
        ))}
        <div className="h-11 bg-gray-200 rounded-lg w-36" />
      </div>
    </div>
  );
}
