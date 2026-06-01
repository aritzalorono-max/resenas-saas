/**
 * GET /api/google-business/reviews
 *
 * Returns all reviews for the authenticated business's Google location.
 * Refreshes the access token if needed (within 5 min of expiry).
 * Annotates each review with replied/flagged status from DB.
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  getReviews,
  getValidAccessToken,
  starRatingToNumber,
} from "@/lib/google-business";
import { logger } from "@/lib/logger";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 5 Google API fetches per minute per user — avoids exhausting OAuth quota
  const rateSvc = await createServiceClient();
  const rl = await checkGeneralRateLimit(rateSvc, `gb-reviews:${user.id}`, 1, 5);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
  }

  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select(
      "id, name, google_access_token, google_refresh_token, google_token_expiry, google_location_name"
    )
    .eq("user_id", user.id)
    .single();

  if (bizError || !business) {
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 }
    );
  }

  if (!business.google_access_token || !business.google_location_name) {
    return NextResponse.json(
      { error: "Google Business no conectado", connected: false },
      { status: 200 }
    );
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(
      business as {
        google_access_token: string;
        google_refresh_token: string | null;
        google_token_expiry: string | null;
        id: string;
      }
    );
  } catch (err) {
    logger.error("[GoogleBusiness] Error al renovar token", err);
    return NextResponse.json(
      { error: "Token de Google caducado. Vuelve a conectar tu cuenta.", connected: false },
      { status: 401 }
    );
  }

  let reviews;
  try {
    reviews = await getReviews(accessToken, business.google_location_name);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    logger.error("[GoogleBusiness] Error al obtener reseñas", err);

    if (errMsg.includes("401")) {
      // Clear tokens so user sees reconnect prompt
      const serviceClient = await createServiceClient();
      await serviceClient
        .from("businesses")
        .update({ google_access_token: null, google_refresh_token: null })
        .eq("id", business.id);

      return NextResponse.json(
        { error: "Sesión de Google caducada. Vuelve a conectar tu cuenta.", connected: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Error al obtener reseñas de Google" },
      { status: 502 }
    );
  }

  // Fetch replied and flagged review names from DB
  const [repliesRes, flagsRes] = await Promise.all([
    supabase
      .from("google_review_replies")
      .select("review_name")
      .eq("business_id", business.id),
    supabase
      .from("google_review_flags")
      .select("review_name, status")
      .eq("business_id", business.id),
  ]);

  const repliedNames = new Set(
    (repliesRes.data ?? []).map((r: { review_name: string }) => r.review_name)
  );
  const flaggedMap = new Map(
    (flagsRes.data ?? []).map((f: { review_name: string; status: string }) => [
      f.review_name,
      f.status,
    ])
  );

  const annotated = reviews.map((review) => ({
    ...review,
    starRatingNum: starRatingToNumber(review.starRating),
    replied:
      repliedNames.has(review.name) || review.reviewReply != null,
    flagged: flaggedMap.has(review.name),
    flagStatus: flaggedMap.get(review.name) ?? null,
  }));

  return NextResponse.json({ reviews: annotated, connected: true });
}
