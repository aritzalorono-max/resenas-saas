import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { ReviewRequest } from "@/types";
import { Check } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  pending:             { label: "Pendiente",      badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400"   },
  positive:            { label: "Positiva",       badge: "bg-green-100 text-green-700",   dot: "bg-green-500"   },
  negative:            { label: "Negativa",       badge: "bg-red-100 text-red-600",       dot: "bg-red-400"     },
  neutral:             { label: "Neutral",        badge: "bg-gray-100 text-gray-600",     dot: "bg-gray-400"    },
  no_response:         { label: "Sin respuesta",  badge: "bg-gray-100 text-gray-500",     dot: "bg-gray-300"    },
  awaiting_screenshot: { label: "Esp. captura",   badge: "bg-purple-100 text-purple-700", dot: "bg-purple-400"  },
  rewarded:            { label: "Recompensado",   badge: "bg-brand-100 text-brand-700",   dot: "bg-brand-500"   },
};

const PAGE_SIZE = 20;

export default async function ResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status: filterStatus, page: pageParam } = await searchParams;
  const page    = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset  = (page - 1) * PAGE_SIZE;
  const active  = filterStatus ?? "all";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  const businessId = business?.id ?? "";

  // Total count for pagination
  let countQuery = supabase
    .from("review_requests")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId);
  if (active !== "all") countQuery = countQuery.eq("status", active);
  const { count: total } = await countQuery;

  // Paginated rows
  let dataQuery = supabase
    .from("review_requests")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);
  if (active !== "all") dataQuery = dataQuery.eq("status", active);
  const { data: requests } = await dataQuery as { data: ReviewRequest[] | null };

  const totalPages  = Math.ceil((total ?? 0) / PAGE_SIZE);
  const hasNext     = page < totalPages;
  const hasPrev     = page > 1;

  const filterTabs = [
    { value: "all",                label: "Todas"        },
    { value: "positive",           label: "Positivas"    },
    { value: "negative",           label: "Negativas"    },
    { value: "neutral",            label: "Neutrales"    },
    { value: "pending",            label: "Pendientes"   },
    { value: "no_response",        label: "Sin resp."    },
    { value: "awaiting_screenshot", label: "Captura"     },
    { value: "rewarded",           label: "Recompensados"},
  ];

  function buildHref(newPage: number, newStatus?: string) {
    const s = newStatus ?? active;
    const params = new URLSearchParams();
    if (s !== "all") params.set("status", s);
    if (newPage > 1) params.set("page", String(newPage));
    const qs = params.toString();
    return `/resenas${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Reseñas y respuestas</h1>
        <p className="text-gray-400 text-sm mt-1">
          {total != null ? `${total} solicitud${total !== 1 ? "es" : ""} en total` : "Historial de todas las solicitudes"}
        </p>
      </div>

      {/* Filter tabs — horizontal scroll en móvil */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterTabs.map((tab) => {
          const isActive = active === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildHref(1, tab.value)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {!requests?.length ? (
        <div className="bg-white rounded-2xl border border-gray-200 px-6 py-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          </div>
          <p className="font-semibold text-gray-700">
            {active === "all"
              ? "Aún no hay solicitudes"
              : `No hay solicitudes en "${filterTabs.find(t => t.value === active)?.label}"`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {active === "all"
              ? "Las solicitudes que envíes aparecerán aquí"
              : "Prueba a cambiar el filtro"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {requests.map((req) => {
              const config = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{req.customer_name}</span>
                        <span className="text-gray-400 text-xs">{req.customer_phone}</span>
                      </div>

                      {req.customer_response ? (
                        <p className="text-gray-700 text-sm mt-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 italic">
                          &ldquo;{req.customer_response}&rdquo;
                        </p>
                      ) : (
                        <p className="text-gray-400 text-xs mt-1.5 italic">Sin respuesta todavía</p>
                      )}

                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <span className="text-xs text-gray-400">
                          {new Date(req.created_at).toLocaleDateString("es-ES", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                        {req.responded_at && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                            Respondió {new Date(req.responded_at).toLocaleDateString("es-ES", {
                              day: "numeric", month: "short",
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        )}
                        {req.sentiment_score !== null && req.sentiment_score !== undefined && (
                          <span className="text-xs text-gray-400 tabular-nums">
                            Score: {(req.sentiment_score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                      {req.follow_up_sent && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Follow-up enviado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
              <p className="text-sm text-gray-500 order-2 sm:order-1">
                Pág. {page}/{totalPages}
                <span className="text-gray-400"> · {total} solicitudes</span>
              </p>
              <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <Link
                  href={hasPrev ? buildHref(page - 1) : "#"}
                  aria-disabled={!hasPrev}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium transition
                    ${hasPrev ? "text-gray-700 hover:border-brand-300 hover:text-brand-700" : "text-gray-300 pointer-events-none"}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Anterior
                </Link>
                <Link
                  href={hasNext ? buildHref(page + 1) : "#"}
                  aria-disabled={!hasNext}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium transition
                    ${hasNext ? "text-gray-700 hover:border-brand-300 hover:text-brand-700" : "text-gray-300 pointer-events-none"}`}
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
