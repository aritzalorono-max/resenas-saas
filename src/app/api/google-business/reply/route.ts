/**
 * POST /api/google-business/reply
 *
 * Publishes a reply to a Google review and records it in the DB.
 *
 * Body: { reviewName: string, replyText: string }
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { replyToReview, refreshAccessToken } from "@/lib/google-business";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { reviewName?: string; replyText?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { reviewName, replyText } = body;

  if (!reviewName || !replyText) {
    return NextResponse.json(
      { error: "Se requieren reviewName y replyText" },
      { status: 400 }
    );
  }

  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select(
      "id, google_access_token, google_refresh_token, google_token_expiry"
    )
    .eq("user_id", user.id)
    .single();

  if (bizError || !business?.google_access_token) {
    return NextResponse.json(
      { error: "Google Business no conectado" },
      { status: 400 }
    );
  }

  // Refresh token if needed
  let accessToken = business.google_access_token as string;
  const expiryDate = business.google_token_expiry
    ? new Date(business.google_token_expiry as string)
    : null;
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

  if ((!expiryDate || expiryDate <= fiveMinutesFromNow) && business.google_refresh_token) {
    try {
      const refreshed = await refreshAccessToken(business.google_refresh_token as string);
      accessToken = refreshed.access_token;
      const serviceClient = await createServiceClient();
      await serviceClient
        .from("businesses")
        .update({
          google_access_token: refreshed.access_token,
          google_token_expiry: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        })
        .eq("id", business.id);
    } catch (err) {
      logger.error("[GoogleBusiness] Error al renovar token para reply", err);
    }
  }

  try {
    await replyToReview(accessToken, reviewName, replyText);
  } catch (err) {
    logger.error("[GoogleBusiness] Error al publicar respuesta", err);
    return NextResponse.json(
      { error: "Error al publicar la respuesta en Google" },
      { status: 502 }
    );
  }

  // Save reply to DB
  const { error: saveError } = await supabase
    .from("google_review_replies")
    .upsert(
      {
        business_id: business.id,
        review_name: reviewName,
        reply_text: replyText,
        published_at: new Date().toISOString(),
      },
      { onConflict: "review_name" }
    );

  if (saveError) {
    logger.warn("[GoogleBusiness] Respuesta publicada pero error al guardar en BD", saveError);
  }

  logger.info("[GoogleBusiness] Respuesta publicada", { reviewName });
  return NextResponse.json({ success: true });
}
