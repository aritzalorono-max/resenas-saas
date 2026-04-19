import { createClient } from "@/lib/supabase/server";
import type { ReviewRequest } from "@/types";

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: string }> = {
  pending: { label: "Pendiente", badge: "bg-yellow-100 text-yellow-800", icon: "⏳" },
  positive: { label: "Positiva", badge: "bg-green-100 text-green-800", icon: "😊" },
  negative: { label: "Negativa", badge: "bg-red-100 text-red-800", icon: "😞" },
  neutral: { label: "Neutral", badge: "bg-gray-100 text-gray-700", icon: "😐" },
  no_response: { label: "Sin respuesta", badge: "bg-gray-100 text-gray-500", icon: "📭" },
};

export default async function ResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  let query = supabase
    .from("review_requests")
    .select("*")
    .eq("business_id", business?.id ?? "")
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "all") {
    query = query.eq("status", filterStatus);
  }

  const { data: requests } = await query as { data: ReviewRequest[] | null };

  const filterTabs = [
    { value: "all", label: "Todas" },
    { value: "positive", label: "Positivas" },
    { value: "negative", label: "Negativas" },
    { value: "neutral", label: "Neutrales" },
    { value: "pending", label: "Pendientes" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reseñas y respuestas</h1>
        <p className="text-gray-500 mt-1">Historial de todas las solicitudes enviadas</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filterTabs.map((tab) => {
          const isActive = (filterStatus ?? "all") === tab.value;
          return (
            <a
              key={tab.value}
              href={tab.value === "all" ? "/resenas" : `/resenas?status=${tab.value}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-300"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      {!requests?.length ? (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium text-gray-600">No hay solicitudes en este filtro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const config = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900">{req.customer_name}</span>
                      <span className="text-gray-400 text-sm">{req.customer_phone}</span>
                    </div>

                    {req.customer_response ? (
                      <p className="text-gray-700 text-sm mt-2 bg-gray-50 rounded-lg px-3 py-2 italic">
                        &ldquo;{req.customer_response}&rdquo;
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm mt-1 italic">Sin respuesta aún</p>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-400">
                        Enviado: {new Date(req.created_at).toLocaleDateString("es-ES", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                      {req.responded_at && (
                        <span className="text-xs text-gray-400">
                          Respondió: {new Date(req.responded_at).toLocaleDateString("es-ES", {
                            day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      )}
                      {req.sentiment_score !== null && (
                        <span className="text-xs text-gray-400">
                          Score: {(req.sentiment_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${config.badge}`}>
                      <span>{config.icon}</span>
                      {config.label}
                    </span>
                    {req.follow_up_sent && (
                      <span className="text-xs text-gray-400">Follow-up enviado ✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
