/**
 * POST /api/google-business/reply
 *
 * Publishes a reply to a Google review and records it in the DB.
 *
 * Body: { reviewName: string, replyText: string }
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { replyToReview, getValidAccessToken } from "@/lib/google-business";
import { logger } from "@/lib/logger";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { sanitizeField } from "@/lib/validation";
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

  // 10 review replies per minute per user
  const rateSvc = await createServiceClient();
  const rl = await checkGeneralRateLimit(rateSvc, `gb-reply:${user.id}`, 1, 10);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
  }

  let body: { reviewName?: string; replyText?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const reviewName = sanitizeField(body.reviewName, 500,  "");
  const replyText  = sanitizeField(body.replyText,  4096, "");

  if (!reviewName || !replyText) {
    return NextResponse.json(
      { error: "Se requieren reviewName y replyText" },
      { status: 400 }
    );
  }

  // Google Business replies are capped at 4096 characters
  if (replyText.length > 4096) {
    return NextResponse.json(
      { error: "La respuesta no puede superar los 4096 caracteres" },
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

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(business as {
      google_access_token: string;
      google_refresh_token: string | null;
      google_token_expiry: string | null;
      id: string;
    });
  } catch (err) {
    logger.error("[GoogleBusiness] Error al renovar token para reply", err);
    return NextResponse.json({ error: "Token expirado, reconecta Google Business" }, { status: 401 });
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
