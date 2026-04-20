import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { ReviewRequest, BusinessStats } from "@/types";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:     { label: "Pendiente",      color: "bg-yellow-100 text-yellow-800" },
  positive:    { label: "Positiva",       color: "bg-green-100 text-green-800"  },
  negative:    { label: "Negativa",       color: "bg-red-100 text-red-800"      },
  neutral:     { label: "Neutral",        color: "bg-gray-100 text-gray-700"    },
  no_response: { label: "Sin respuesta",  color: "bg-gray-100 text-gray-500"    },
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
    { label: "Total",      value: stats?.total_requests  ?? 0,    icon: "📨" },
    { label: "Positivas",  value: stats?.positive_count  ?? 0,    icon: "😊" },
    { label: "Negativas",  value: stats?.negative_count  ?? 0,    icon: "😞" },
    { label: "% Positivo", value: `${stats?.positive_rate ?? 0}%`, icon: "📈" },
  ];

  return (
    <div>
      {/* Título */}
      <div className="mb-5 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
          Bienvenido,<br className="sm:hidden" /> {business?.name ?? ""}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de tus reseñas</p>
      </div>

      {/* Alerta Google Maps */}
      {!business?.google_maps_url && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-yellow-500 text-lg shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="font-medium text-yellow-800 text-sm">Configura tu enlace de Google Maps</p>
            <p className="text-sm text-yellow-700 mt-0.5">
              Sin el enlace no podemos redirigir a tus clientes a dejar reseña.{" "}
              <Link href="/configuracion" className="underline font-medium">
                Configurar →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 lg:mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* CTA principal — botón grande para móvil */}
      <Link
        href="/clientes"
        className="block bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                   rounded-xl p-5 mb-5 lg:mb-8 transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-base lg:text-lg leading-snug">
              ¿Tienes un cliente delante?
            </p>
            <p className="text-brand-100 text-sm mt-0.5">
              Envíale un WhatsApp de reseña ahora
            </p>
          </div>
          <span className="text-white text-2xl shrink-0 ml-3">💬</span>
        </div>
      </Link>

      {/* Últimas solicitudes */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Últimas solicitudes</h2>
          <Link href="/resenas" className="text-xs text-brand-600 font-medium">
            Ver todas →
          </Link>
        </div>

        {!recent?.length ? (
          <div className="px-4 py-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium text-sm">Aún no has enviado ninguna solicitud</p>
            <Link href="/clientes" className="text-sm text-brand-600 mt-1 inline-block">
              Envía tu primera solicitud →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((req) => {
              const s = STATUS_LABELS[req.status] ?? STATUS_LABELS.pending;
              return (
                <div key={req.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{req.customer_name}</p>
                    <p className="text-xs text-gray-400">{req.customer_phone}</p>
                    {req.customer_response && (
                      <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">
                        &ldquo;{req.customer_response}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${s.color}`}>
                      {s.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(req.created_at).toLocaleDateString("es-ES", {
                        day: "numeric", month: "short"
                      })}
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
