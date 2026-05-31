/**
 * GET /api/google-business/callback
 *
 * OAuth callback from Google. Exchanges the authorization code for tokens,
 * fetches the first account/location, saves everything to the businesses table,
 * then redirects to /google-business.
 */

import { createServiceClient } from "@/lib/supabase/server";
import {
  exchangeCode,
  getAccounts,
  getLocations,
} from "@/lib/google-business";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<never> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    logger.warn("[GoogleBusiness] OAuth cancelado o con error", { error });
    redirect("/google-business?error=oauth_cancelled");
  }

  if (!code || !state) {
    logger.warn("[GoogleBusiness] Callback sin code o state");
    redirect("/google-business?error=missing_params");
  }

  // Validate state against server-side cookie to prevent CSRF
  const cookieStore = await cookies();
  const stored = cookieStore.get("__gb_oauth_state");
  if (!stored) {
    logger.warn("[GoogleBusiness] Cookie de estado OAuth no encontrada");
    redirect("/google-business?error=invalid_state");
  }

  let oauthData: { nonce: string; userId: string };
  try {
    oauthData = JSON.parse(stored.value);
  } catch {
    logger.error("[GoogleBusiness] Cookie de estado OAuth inválida");
    redirect("/google-business?error=invalid_state");
  }

  if (oauthData.nonce !== state) {
    logger.warn("[GoogleBusiness] State no coincide — posible CSRF");
    redirect("/google-business?error=invalid_state");
  }

  cookieStore.delete("__gb_oauth_state");
  const userId = oauthData.userId;

  // Exchange code for tokens
  let tokens: Awaited<ReturnType<typeof exchangeCode>>;
  try {
    tokens = await exchangeCode(code);
  } catch (err) {
    logger.error("[GoogleBusiness] Error al intercambiar código OAuth", err);
    redirect("/google-business?error=token_exchange");
  }

  const accessToken = tokens.access_token;
  const refreshToken = tokens.refresh_token ?? null;
  const expiryDate = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  // Get first account
  let accountName: string | null = null;
  let locationName: string | null = null;

  try {
    const accounts = await getAccounts(accessToken);
    if (accounts.length > 0) {
      accountName = accounts[0].name;

      const locations = await getLocations(accessToken, accountName);
      if (locations.length > 0) {
        locationName = locations[0].name;
      }
    }
  } catch (err) {
    logger.warn("[GoogleBusiness] No se pudo obtener cuenta/ubicación", err);
    // Continue — tokens are still valid, user can select later
  }

  // Save to businesses table (service client bypasses RLS)
  const supabase = await createServiceClient();
  const { error: updateError } = await supabase
    .from("businesses")
    .update({
      google_access_token: accessToken,
      google_refresh_token: refreshToken,
      google_token_expiry: expiryDate,
      google_account_name: accountName,
      google_location_name: locationName,
    })
    .eq("user_id", userId);

  if (updateError) {
    logger.error("[GoogleBusiness] Error al guardar tokens en BD", updateError);
    redirect("/google-business?error=db_save");
  }

  logger.info("[GoogleBusiness] Tokens guardados correctamente", {
    userId,
    accountName,
    locationName,
  });

  redirect("/google-business");
}
