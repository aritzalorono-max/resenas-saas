const VERCEL_API = "https://vercel.com/api";
const TOKEN      = process.env.VERCEL_TOKEN ?? "";
const PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "";

export interface VercelAnalyticsSummary {
  pageviews: number;
  visitors: number;
  topPages: { path: string; visitors: number }[];
}

function isoRange(days: number) {
  const to   = new Date();
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return { from: from.toISOString(), to: to.toISOString() };
}

async function vercelGet(path: string, params: Record<string, string>) {
  if (!TOKEN || !PROJECT_ID) return null;
  const qs  = new URLSearchParams({ projectId: PROJECT_ID, ...params });
  const url = `${VERCEL_API}${path}?${qs}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    next:    { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getVercelAnalytics(days = 30): Promise<VercelAnalyticsSummary | null> {
  if (!TOKEN || !PROJECT_ID) return null;

  const { from, to } = isoRange(days);
  const env = "production";

  const [summary, pages] = await Promise.all([
    vercelGet("/v1/web/analytics/summary", { from, to, environment: env }),
    vercelGet("/v1/web/analytics/page-views/by-path", { from, to, environment: env, limit: "10" }),
  ]);

  if (!summary) return null;

  return {
    pageviews: summary.pageviews ?? summary.total ?? 0,
    visitors:  summary.visitors  ?? summary.uniqueVisitors ?? 0,
    topPages:  (pages?.data ?? pages?.pages ?? []).slice(0, 10).map((p: { path?: string; page?: string; visitors?: number; count?: number }) => ({
      path:     p.path ?? p.page ?? "—",
      visitors: p.visitors ?? p.count ?? 0,
    })),
  };
}
