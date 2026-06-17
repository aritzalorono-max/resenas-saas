export default function CuentaLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-7 bg-gray-200 rounded-lg w-32 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-56" />
      </div>

      {/* Account info card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
        <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
        <div className="h-10 bg-gray-100 rounded-lg mb-4" />
      </div>

      {/* Password card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-44 mb-2" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-gray-100 rounded w-28 mb-2" />
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
        ))}
        <div className="h-11 bg-gray-200 rounded-lg w-44" />
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
        <div className="h-5 bg-red-100 rounded w-36 mb-3" />
        <div className="h-4 bg-red-100 rounded w-64 mb-4" />
        <div className="h-10 bg-red-100 rounded-lg w-40" />
      </div>
    </div>
  );
}
