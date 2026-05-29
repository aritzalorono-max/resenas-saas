import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm w-full shadow-sm">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔍</span>
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-2">Página no encontrada</h1>
        <p className="text-sm text-gray-500 mb-6">
          La URL que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/dashboard"
          className="inline-block w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
