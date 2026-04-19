import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { ReviewRequest, BusinessStats } from "@/types";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  positive: { label: "Positiva", color: "bg-green-100 text-green-800" },
  negative: { label: "Negativa", color: "bg-red-100 text-red-800" },
  neutral: { label: "Neutral", color: "bg-gray-100 text-gray-700" },
  no_response: { label: "Sin respuesta", color: "bg-gray-100 text-gray-500" },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: stats } = await supabase
    .from("business_stats")
    .select("*")
    .eq("user_id", user!.id)
    .single() as { data: BusinessStats | null };

  const { data: recent } = await supabase
    .from("review_requests")
    .select("*")
    .eq("business_id", business?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(10) as { data: ReviewRequest[] | null };

  const statCards = [
    { label: "Total enviadas", value: stats?.total_requests ?? 0, icon: "📨", color: "blue" },
    { label: "Respuestas positivas", value: stats?.positive_count ?? 0, icon: "😊", color: "green" },
    { label: "Respuestas negativas", value: stats?.negative_count ?? 0, icon: "😞", color: "red" },
    { label: "Tasa positiva", value: `${stats?.positive_rate ?? 0}%`, icon: "📈", color: "purple" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {business?.name ?? ""}
        </h1>
        <p className="text-gray-500 mt-1">Aquí tienes un resumen de tus reseñas</p>
      </div>

      {!business?.google_maps_url && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-yellow-500 text-xl mt-0.5">⚠️</span>
          <div>
            <p className="font-medium text-yellow-800">Configura tu enlace de Google Maps</p>
            <p className="text-sm text-yellow-700 mt-0.5">
              Sin el enlace, no podremos enviar a tus clientes satisfechos a dejar reseña.{" "}
              <Link href="/configuracion" className="underline font-medium">
                Configurar ahora →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div className="bg-brand-600 rounded-xl p-6 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">¿Tienes un cliente delante?</h2>
          <p className="text-brand-100 text-sm mt-1">Envíale una solicitud de reseña por WhatsApp ahora mismo</p>
        </div>
        <Link
          href="/clientes"
          className="bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-50 transition whitespace-nowrap"
        >
          Enviar solicitud →
        </Link>
      </div>

      {/* Recent requests */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Últimas solicitudes</h2>
          <Link href="/resenas" className="text-sm text-brand-600 hover:underline">
            Ver todas →
          </Link>
        </div>

        {!recent?.length ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">Aún no has enviado ninguna solicitud</p>
            <p className="text-sm mt-1">
              <Link href="/clientes" className="text-brand-600 hover:underline">
                Envía tu primera solicitud
              </Link>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((req) => {
              const s = STATUS_LABELS[req.status] ?? STATUS_LABELS.pending;
              return (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{req.customer_name}</p>
                    <p className="text-sm text-gray-500">{req.customer_phone}</p>
                    {req.customer_response && (
                      <p className="text-sm text-gray-600 mt-1 italic truncate max-w-sm">
                        &ldquo;{req.customer_response}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                      {s.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(req.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
