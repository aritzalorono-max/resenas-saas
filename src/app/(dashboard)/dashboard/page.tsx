import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { ReviewRequest, BusinessStats } from "@/types";
import { RingChart } from "@/components/ui/RingChart";
import { AlertTriangle } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:              { label: "Pendiente",        color: "bg-amber-100 text-amber-700"   },
  positive:             { label: "Positiva",         color: "bg-green-100 text-green-700"   },
  negative:             { label: "Negativa",         color: "bg-red-100 text-red-600"       },
  neutral:              { label: "Neutral",          color: "bg-gray-100 text-gray-600"     },
  no_response:          { label: "Sin respuesta",    color: "bg-gray-100 text-gray-500"     },
  awaiting_screenshot:  { label: "Esp. captura",     color: "bg-purple-100 text-purple-700" },
  rewarded:             { label: "Recompensado",     color: "bg-brand-100 text-brand-700"   },
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

  const total      = stats?.total_requests  ?? 0;
  const positives  = stats?.positive_count  ?? 0;
  const negatives  = stats?.negative_count  ?? 0;
  const neutrals   = stats?.neutral_count   ?? 0;
  const pending    = stats?.pending_count   ?? 0;
  const rate       = Number(stats?.positive_rate ?? 0);
  const responded  = positives + negatives + neutrals;

  const bars = [
    { label: "Positivas",  count: positives, color: "bg-green-500",  bg: "bg-green-100" },
    { label: "Negativas",  count: negatives, color: "bg-red-400",    bg: "bg-red-100"   },
    { label: "Neutrales",  count: neutrals,  color: "bg-gray-400",   bg: "bg-gray-100"  },
    { label: "Pendientes", count: pending,   color: "bg-amber-400",  bg: "bg-amber-100" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Título */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
          Bienvenido,<br className="sm:hidden" /> {business?.name ?? ""}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Resumen de tu actividad de reseñas</p>
      </div>

      {/* Alerta Google Maps */}
      {!business?.google_maps_url && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Configura tu plataforma de reseñas</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Sin un enlace activo no podemos redirigir a tus clientes satisfechos a dejar reseña.{" "}
              <Link href="/configuracion" className="underline font-semibold">
                Configurar →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Ring chart — tasa positiva */}
        <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 shadow-card">
          <RingChart rate={rate} />
          <p className="text-xs text-gray-400 mt-1">tasa positiva</p>
        </div>

        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-card">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Total</p>
          <p className="text-3xl font-bold text-gray-900 leading-none">{total}</p>
          <p className="text-xs text-gray-400 mt-1.5">solicitudes enviadas</p>
        </div>

        {/* Positivas */}
        <div className="bg-white border border-green-100 rounded-2xl p-4 shadow-card">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Positivas</p>
          <p className="text-3xl font-bold text-gray-900 leading-none">{positives}</p>
          <div className="mt-2 h-1.5 rounded-full bg-green-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700"
              style={{ width: total ? `${(positives / total) * 100}%` : "0%" }}
            />
          </div>
        </div>

        {/* Negativas */}
        <div className="bg-white border border-red-50 rounded-2xl p-4 shadow-card">
          <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-2">Negativas</p>
          <p className="text-3xl font-bold text-gray-900 leading-none">{negatives}</p>
          <div className="mt-2 h-1.5 rounded-full bg-red-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-400 transition-all duration-700"
              style={{ width: total ? `${(negatives / total) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Distribución de respuestas */}
      {responded > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-card animate-slide-up animation-delay-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Distribución de respuestas
          </h2>
          <div className="space-y-3">
            {bars.filter(b => b.count > 0).map((bar) => {
              const pct = total > 0 ? Math.round((bar.count / total) * 100) : 0;
              return (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20 shrink-0">{bar.label}</span>
                  <div className={`flex-1 h-2 rounded-full ${bar.bg} overflow-hidden`}>
                    <div
                      className={`h-full rounded-full ${bar.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA principal */}
      <Link
        href="/clientes"
        className="block rounded-2xl p-5 mb-6 transition-all duration-200
                   bg-gradient-to-r from-brand-600 to-brand-500
                   hover:from-brand-700 hover:to-brand-600
                   active:scale-[0.99] shadow-md shadow-brand-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-base lg:text-lg leading-snug">
              ¿Tienes un cliente delante?
            </p>
            <p className="text-brand-100 text-sm mt-0.5">
              Envíale un WhatsApp de reseña ahora mismo
            </p>
          </div>
          <div className="bg-white/20 rounded-xl p-2.5 ml-3 shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Últimas solicitudes */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Últimas solicitudes</h2>
          <Link href="/resenas" className="text-xs text-brand-600 font-semibold hover:text-brand-700">
            Ver todas →
          </Link>
        </div>

        {!recent?.length ? (
          <div className="px-6 py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="font-semibold text-gray-700 text-sm">Aún no hay solicitudes</p>
            <p className="text-xs text-gray-400 mt-1 mb-4 max-w-xs">
              Cuando envíes tu primera solicitud de reseña aparecerá aquí
            </p>
            <Link
              href="/clientes"
              className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              Enviar primera solicitud →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((req) => {
              const s = STATUS_LABELS[req.status] ?? STATUS_LABELS.pending;
              return (
                <div key={req.id} className="px-4 py-3.5 flex items-start justify-between gap-3 hover:bg-gray-50/50 transition">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">{req.customer_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{req.customer_phone}</p>
                    {req.customer_response && (
                      <p className="text-xs text-gray-500 mt-1.5 italic line-clamp-1 bg-gray-50 px-2 py-1 rounded-lg">
                        &ldquo;{req.customer_response}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
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
