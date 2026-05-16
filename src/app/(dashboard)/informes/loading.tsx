export default function InformesLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-7 bg-gray-200 rounded-lg w-32 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-72" />
      </div>

      {/* Action card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="h-5 bg-gray-200 rounded w-48 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-80 mb-5" />
        <div className="h-11 bg-gray-200 rounded-xl w-52" />
      </div>

      {/* History list */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100">
          <div className="h-4 bg-gray-100 rounded w-32" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 border-b border-gray-50 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-4 bg-gray-100 rounded w-36" />
              <div className="h-3 bg-gray-50 rounded w-24" />
            </div>
            <div className="h-8 bg-gray-100 rounded-lg w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
