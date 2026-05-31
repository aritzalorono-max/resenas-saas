/**
 * GET /api/google-business/connect
 *
 * Initiates the Google OAuth flow for Google Business Profile.
 * Requires an active user session.
 */

import { createClient } from "@/lib/supabase/server";
import { getAuthUrl } from "@/lib/google-business";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(): Promise<never> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    logger.warn("[GoogleBusiness] Intento de conexión sin sesión activa");
    redirect("/login");
  }

  // Generate a random nonce as state — userId is stored server-side in a cookie
  const nonce = crypto.randomBytes(32).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("__gb_oauth_state", JSON.stringify({ nonce, userId: user.id }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  const authUrl = getAuthUrl(nonce);
  logger.info("[GoogleBusiness] Redirigiendo a Google OAuth", { userId: user.id });
  redirect(authUrl);
}
