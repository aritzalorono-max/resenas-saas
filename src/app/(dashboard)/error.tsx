'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <p className="text-gray-500 text-sm">Se produjo un error al cargar la página.</p>
      <pre className="text-xs text-red-500 bg-red-50 rounded p-3 max-w-xl overflow-auto">{error.message}</pre>
      <button onClick={reset} className="btn-primary text-sm">Reintentar</button>
    </div>
  )
}
