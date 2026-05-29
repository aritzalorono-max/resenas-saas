"use server";

/**
 * Server action: dispara manualmente la captura de la puntuación de Google Maps
 * para el negocio del usuario autenticado.
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { extractPlaceIdFromUrl, findPlaceIdByName, getPlaceRating } from "@/lib/google-places";
import { logger } from "@/lib/logger";

export async function fetchGoogleMapsSnapshot(): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const { data: biz } = await supabase
    .from("businesses")
    .select("id, name, google_maps_url, google_place_id")
    .eq("user_id", user.id)
    .single();

  if (!biz) return { ok: false, error: "Negocio no encontrado" };

  // Resolve Place ID
  let placeId: string | null = biz.google_place_id ?? null;
  if (!placeId && biz.google_maps_url) placeId = await extractPlaceIdFromUrl(biz.google_maps_url);
  if (!placeId && biz.name)            placeId = await findPlaceIdByName(biz.name);

  if (!placeId) return { ok: false, error: "No se pudo encontrar el negocio en Google Maps" };

  // Save Place ID if newly resolved
  if (!biz.google_place_id) {
    const service = await createServiceClient();
    await service.from("businesses").update({ google_place_id: placeId }).eq("id", biz.id);
  }

  // Fetch rating
  const { rating, review_count } = await getPlaceRating(placeId);
  if (rating === null) return { ok: false, error: "No se obtuvo puntuación de Google Maps" };

  // Save snapshot using service client (bypasses RLS for INSERT)
  const service = await createServiceClient();
  const { error } = await service
    .from("google_maps_snapshots")
    .insert({ business_id: biz.id, place_id: placeId, rating, review_count });

  if (error) {
    logger.error("Error al guardar snapshot manual", error);
    return { ok: false, error: `Error al guardar: ${error.message} (code: ${error.code})` };
  }

  logger.info(`Snapshot manual guardado: "${biz.name}" → ${rating}★ (${review_count})`);
  return { ok: true };
}
