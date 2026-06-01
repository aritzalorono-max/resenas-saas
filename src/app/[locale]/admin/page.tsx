import { createServiceClient } from "@/lib/supabase/server";
import type { ReviewStatus } from "@/types";
import { getVercelAnalytics } from "@/lib/vercel-analytics";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function pct(n: number) {
  return `${Math.round(n)}%`;
}

const STATUS_CONFIG: Record<ReviewStatus, { label: string; cls: string }> = {
  pending:             { label: "Pendiente",     cls: "bg-gray-700 text-gray-300" },
  positive:            { label: "Positiva",      cls: "bg-green-900/60 text-green-400" },
  negative:            { label: "Negativa",      cls: "bg-red-900/60 text-red-400" },
  neutral:             { label: "Neutral",       cls: "bg-blue-900/60 text-blue-400" },
  no_response:         { label: "Sin respuesta", cls: "bg-gray-800 text-gray-600" },
  awaiting_screenshot: { label: "Captura pend.", cls: "bg-purple-900/60 text-purple-400" },
  rewarded:            { label: "Recompensado",  cls: "bg-amber-900/60 text-amber-400" },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AdminPage() {
  const supabase = await createServiceClient();

  // Fetch all data in parallel
  const [
    { data: businesses },
    { data: statsData },
    { data: { users } },
    { data: recentRequests },
    { count: todayCount },
    { data: recentPayments },
    analytics,
  ] = await Promise.all([
    supabase.from("businesses")
      .select("id, user_id, name, description, google_maps_url, review_links, incentive_enabled, incentive_description, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("business_stats").select("*"),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase
      .from("review_requests")
      .select("id, customer_name, customer_phone, status, customer_response, created_at, responded_at, business_id, businesses(name)")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("review_requests")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase
      .from("payments")
      .select("id, user_id, amount, currency, plan, status, description, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    getVercelAnalytics(30),
  ]);

  // Merge business + stats + user email
  const statsMap = new Map((statsData ?? []).map((s) => [s.business_id, s]));
  const usersMap = new Map((users ?? []).map((u) => [u.id, u]));

  const enriched = (businesses ?? []).map((b) => ({
    ...b,
    stats: statsMap.get(b.id) ?? null,
    ownerEmail: usersMap.get(b.user_id)?.email ?? "—",
    ownerCreatedAt: usersMap.get(b.user_id)?.created_at ?? null,
  }));

  // Global KPIs
  const totalBusinesses = enriched.length;
  const totalRequests   = enriched.reduce((acc, b) => acc + (b.stats?.total_requests ?? 0), 0);
  const avgPositiveRate = enriched.length
    ? enriched.reduce((acc, b) => acc + (b.stats?.positive_rate ?? 0), 0) / enriched.length
    : 0;
  const withIncentive   = enriched.filter((b) => b.incentive_enabled).length;

  // Payments KPIs
  const paidPayments  = (recentPayments ?? []).filter((p) => p.status === "paid");
  const totalRevenue  = paidPayments.reduce((acc, p) => acc + p.amount, 0);
  const payingUsers   = new Set(paidPayments.map((p) => p.user_id)).size;

  function fmtMoney(cents: number, currency: string) {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
  }

  return (
    <div className="space-y-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Visión general</h1>
        <p className="text-gray-500 text-sm mt-1">Todos los negocios y solicitudes de la plataforma</p>
      </div>

      {/* ── Vercel Analytics ───────────────────────────────────────────── */}
      {analytics ? (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:col-span-1">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Visitas únicas (30d)</p>
            <p className="text-3xl font-extrabold text-white">{analytics.visitors.toLocaleString("es-ES")}</p>
            <p className="text-gray-600 text-xs mt-1">Vercel Analytics · producción</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:col-span-1">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Páginas vistas (30d)</p>
            <p className="text-3xl font-extrabold text-white">{analytics.pageviews.toLocaleString("es-ES")}</p>
            <p className="text-gray-600 text-xs mt-1">Vercel Analytics · producción</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:col-span-1">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-3">Top páginas (30d)</p>
            <ul className="space-y-1.5">
              {analytics.topPages.slice(0, 5).map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 text-xs truncate font-mono">{p.path}</span>
                  <span className="text-white text-xs font-semibold shrink-0">{p.visitors.toLocaleString("es-ES")}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <div className="bg-gray-900 border border-gray-800/50 rounded-xl px-5 py-4 text-gray-600 text-xs">
          Analytics de Vercel no disponible — configura <code className="text-gray-500">VERCEL_TOKEN</code> y <code className="text-gray-500">VERCEL_PROJECT_ID</code> en las variables de entorno.
        </div>
      )}

      {/* ── KPI cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Negocios registrados", value: totalBusinesses,       sub: `${withIncentive} con incentivo` },
          { label: "Usuarios totales",     value: users?.length ?? 0,    sub: `${payingUsers} con pagos` },
          { label: "Solicitudes totales",  value: totalRequests,         sub: "todas las épocas" },
          { label: "Solicitudes hoy",      value: todayCount ?? 0,       sub: new Date().toLocaleDateString("es-ES") },
          { label: "Tasa positiva media",  value: pct(avgPositiveRate),  sub: "media entre negocios" },
          { label: "Ingresos registrados", value: totalRevenue > 0 ? fmtMoney(totalRevenue, "eur") : "—", sub: `${paidPayments.length} pagos` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
            <p className="text-3xl font-extrabold text-white">{value}</p>
            <p className="text-gray-600 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Businesses table ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Negocios <span className="text-gray-600 font-normal text-sm ml-1">({totalBusinesses})</span>
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Negocio</th>
                  <th className="text-left px-4 py-3 font-medium">Propietario</th>
                  <th className="text-left px-4 py-3 font-medium">Plataforma activa</th>
                  <th className="text-right px-4 py-3 font-medium">Solicitudes</th>
                  <th className="text-right px-4 py-3 font-medium">Positivas</th>
                  <th className="text-right px-4 py-3 font-medium">Negativas</th>
                  <th className="text-right px-4 py-3 font-medium">Pendientes</th>
                  <th className="text-center px-4 py-3 font-medium">Incentivo</th>
                  <th className="text-right px-4 py-3 font-medium">Registrado</th>
                </tr>
              </thead>
              <tbody>
                {enriched.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-gray-600">
                      No hay negocios registrados
                    </td>
                  </tr>
                )}
                {enriched.map((b) => {
                  const s = b.stats;
                  const activeLink = (b.review_links ?? []).find((l: { url: string }) => l.url === b.google_maps_url);
                  return (
                    <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white truncate max-w-[180px]">{b.name}</p>
                        {b.description && (
                          <p className="text-gray-600 text-xs truncate max-w-[180px]">{b.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-300 text-xs truncate max-w-[200px]">{b.ownerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        {activeLink ? (
                          <span className="inline-flex items-center gap-1.5 bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-full">
                            {(activeLink as { name: string }).name}
                          </span>
                        ) : (
                          <span className="text-gray-700 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-semibold">
                        {s?.total_requests ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-green-400 font-medium">{s?.positive_count ?? 0}</span>
                        {s && s.total_requests > 0 && (
                          <span className="text-gray-600 text-xs ml-1">
                            ({pct(s.positive_rate)})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-red-400 font-medium">
                        {s?.negative_count ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">
                        {s?.pending_count ?? 0}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {b.incentive_enabled ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" title={b.incentive_description ?? ""} />
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-gray-700" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap">
                        {fmtDate(b.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Recent requests ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Últimas solicitudes <span className="text-gray-600 font-normal text-sm ml-1">(últimas 50)</span>
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Negocio</th>
                  <th className="text-left px-4 py-3 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium">Teléfono</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 font-medium">Respuesta</th>
                  <th className="text-right px-4 py-3 font-medium">Enviado</th>
                  <th className="text-right px-4 py-3 font-medium">Respondido</th>
                </tr>
              </thead>
              <tbody>
                {(recentRequests ?? []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-600">
                      No hay solicitudes todavía
                    </td>
                  </tr>
                )}
                {(recentRequests ?? []).map((r) => {
                  const statusCfg = STATUS_CONFIG[r.status as ReviewStatus] ?? STATUS_CONFIG.pending;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const businessName = (r.businesses as any)?.name ?? "—";
                  return (
                    <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-300 text-xs max-w-[140px] truncate">
                        {businessName}
                      </td>
                      <td className="px-4 py-3 text-white font-medium text-xs whitespace-nowrap">
                        {r.customer_name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono whitespace-nowrap">
                        {r.customer_phone}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.cls}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[260px]">
                        <span className="truncate block" title={r.customer_response ?? ""}>
                          {r.customer_response
                            ? r.customer_response.slice(0, 80) + (r.customer_response.length > 80 ? "…" : "")
                            : <em className="text-gray-700">sin respuesta</em>
                          }
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap">
                        {fmt(r.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap">
                        {r.responded_at ? fmt(r.responded_at) : <span className="text-gray-800">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Payments ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Últimos pagos <span className="text-gray-600 font-normal text-sm ml-1">({recentPayments?.length ?? 0})</span>
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Usuario</th>
                  <th className="text-left px-4 py-3 font-medium">Plan</th>
                  <th className="text-left px-4 py-3 font-medium">Descripción</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                  <th className="text-right px-4 py-3 font-medium">Importe</th>
                  <th className="text-right px-4 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {(recentPayments ?? []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-600">
                      No hay pagos registrados todavía
                    </td>
                  </tr>
                )}
                {(recentPayments ?? []).map((p) => {
                  const owner = usersMap.get(p.user_id);
                  const statusCls: Record<string, string> = {
                    paid:     "bg-green-900/60 text-green-400",
                    pending:  "bg-yellow-900/60 text-yellow-400",
                    failed:   "bg-red-900/60 text-red-400",
                    refunded: "bg-gray-800 text-gray-500",
                  };
                  const statusLabel: Record<string, string> = {
                    paid: "Pagado", pending: "Pendiente", failed: "Fallido", refunded: "Reembolso",
                  };
                  return (
                    <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-300 text-xs truncate max-w-[200px]">
                        {owner?.email ?? p.user_id.slice(0, 8) + "…"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full font-medium">
                          {p.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[200px]">
                        {p.description ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${statusCls[p.status] ?? "bg-gray-800 text-gray-500"}`}>
                          {statusLabel[p.status] ?? p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-white whitespace-nowrap">
                        {fmtMoney(p.amount, p.currency)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap">
                        {fmtDate(p.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Users raw list ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Usuarios registrados <span className="text-gray-600 font-normal text-sm ml-1">({users?.length ?? 0})</span>
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Negocio</th>
                  <th className="text-center px-4 py-3 font-medium">Email confirmado</th>
                  <th className="text-right px-4 py-3 font-medium">Último acceso</th>
                  <th className="text-right px-4 py-3 font-medium">Registrado</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map((u) => {
                  const biz = (businesses ?? []).find((b) => b.user_id === u.id);
                  return (
                    <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-200 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {biz ? (
                          <span className="font-medium text-gray-300">{biz.name}</span>
                        ) : (
                          <span className="text-gray-700 italic">Sin negocio</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.email_confirmed_at ? (
                          <span className="text-green-500 text-xs">✓</span>
                        ) : (
                          <span className="text-gray-700 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap">
                        {u.last_sign_in_at ? fmt(u.last_sign_in_at) : <span className="text-gray-800">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 text-xs whitespace-nowrap">
                        {fmtDate(u.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
