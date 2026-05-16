export default function FacturacionLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-7 bg-gray-200 rounded-lg w-40 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-56" />
      </div>

      {/* Plan card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-28" />
          <div className="h-6 bg-gray-100 rounded-full w-20" />
        </div>
        <div className="h-4 bg-gray-100 rounded w-64 mb-4" />
        <div className="h-10 bg-gray-200 rounded-xl w-48" />
      </div>

      {/* Billing form card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="h-5 bg-gray-200 rounded w-44 mb-5" />
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-gray-100 rounded w-24 mb-2" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
