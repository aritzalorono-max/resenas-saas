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

  // Encode userId in state so the callback can look up the business
  const state = Buffer.from(user.id).toString("base64");
  const authUrl = getAuthUrl(state);

  logger.info("[GoogleBusiness] Redirigiendo a Google OAuth", { userId: user.id });
  redirect(authUrl);
}
