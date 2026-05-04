/**
 * GET /api/cron/google-maps-snapshot
 *
 * Cron job diario que consulta la puntuación de Google Maps de cada negocio
 * y guarda un snapshot en la tabla google_maps_snapshots.
 *
 * Invocado automáticamente por Vercel Cron a las 08:00 UTC cada día.
 * También puede invocarse manualmente desde el dashboard (server action).
 *
 * Protección: requiere el header Authorization: Bearer {CRON_SECRET}
 * en producción (Vercel lo añade automáticamente).
 */

import { createServiceClient } from "@/lib/supabase/server";
import { extractPlaceIdFromUrl, findPlaceIdByName, getPlaceRating } from "@/lib/google-places";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const maxDuration = 60;

// Max simultaneous Google Places API calls. Higher values finish faster
// but risk hitting the QPS quota (default: 100/s for Places API).
const CONCURRENCY = 5;

type SnapshotResult = "processed" | "skipped" | "error";

async function processOneBusiness(
  biz: { id: string; name: string; google_maps_url: string | null; google_place_id: string | null },
  supabase: Awaited<ReturnType<typeof createServiceClient>>
): Promise<SnapshotResult> {
  try {
    // ── 1. Resolve Place ID ───────────────────────────────────────────────
    let placeId: string | null = biz.google_place_id ?? null;

    if (!placeId && biz.google_maps_url) {
      placeId = extractPlaceIdFromUrl(biz.google_maps_url);
    }

    if (!placeId && biz.name) {
      placeId = await findPlaceIdByName(biz.name);
    }

    if (placeId && !biz.google_place_id) {
      await supabase
        .from("businesses")
        .update({ google_place_id: placeId })
        .eq("id", biz.id);
      logger.info(`Place ID resuelto para "${biz.name}": ${placeId}`);
    }

    if (!placeId) {
      logger.warn(`No se pudo resolver Place ID para "${biz.name}"`);
      return "skipped";
    }

    // ── 2. Fetch current rating ───────────────────────────────────────────
    const { rating, review_count } = await getPlaceRating(placeId);

    if (rating === null) {
      logger.warn(`Sin datos de puntuación para "${biz.name}" (${placeId})`);
      return "skipped";
    }

    // ── 3. Save snapshot ──────────────────────────────────────────────────
    const { error: insertErr } = await supabase
      .from("google_maps_snapshots")
      .insert({ business_id: biz.id, place_id: placeId, rating, review_count });

    if (insertErr) {
      logger.error(`Error al guardar snapshot para "${biz.name}"`, insertErr);
      return "error";
    }

    logger.info(`Snapshot guardado: "${biz.name}" → ${rating}★ (${review_count} reseñas)`);
    return "processed";
  } catch (err) {
    logger.error(`Error inesperado procesando "${biz.name}"`, err);
    return "error";
  }
}

export async function GET(request: Request): Promise<Response> {
  // ── Auth check ────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createServiceClient();

  const { data: businesses, error: bizErr } = await supabase
    .from("businesses")
    .select("id, name, google_maps_url, google_place_id")
    .not("google_maps_url", "is", null);

  if (bizErr || !businesses?.length) {
    logger.info("Cron Google Maps: sin negocios que procesar");
    return Response.json({ processed: 0, errors: 0 });
  }

  let processed = 0;
  let errors    = 0;

  // Process in batches of CONCURRENCY to stay within Google Places API quota.
  // Sequential batches (not fully concurrent) give predictable throughput.
  for (let i = 0; i < businesses.length; i += CONCURRENCY) {
    const batch = businesses.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((biz) => processOneBusiness(biz, supabase))
    );
    for (const r of results) {
      const value = r.status === "fulfilled" ? r.value : "error";
      if (value === "processed") processed++;
      if (value === "error")     errors++;
    }
  }

  return Response.json({ processed, errors, total: businesses.length });
}
