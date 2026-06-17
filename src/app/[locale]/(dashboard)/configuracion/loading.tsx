export default function ConfiguracionLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-7 bg-gray-200 rounded-lg w-56 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-80" />
      </div>

      {/* Main form card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-gray-100 rounded w-24 mb-2" />
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Platform links card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="h-11 bg-gray-200 rounded-lg w-40" />
    </div>
  );
}
