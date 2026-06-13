export default function ClientesLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-7 bg-gray-200 rounded-lg w-40 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64" />
      </div>

      {/* Form card skeleton */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-5" />
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-12 bg-gray-200 rounded-xl" />
      </div>

      {/* Bulk section skeleton */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-28 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200" />
      </div>
    </div>
  );
}
