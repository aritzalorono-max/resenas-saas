/**
 * GET /api/google-business/debug
 *
 * Temporary diagnostic endpoint — calls getAccounts() and getLocations()
 * and returns the raw result so we can see what Google is returning.
 * Only accessible to the authenticated user.
 */

import { createClient } from "@/lib/supabase/server";
import { getAccounts, getLocations, getValidAccessToken } from "@/lib/google-business";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, google_access_token, google_refresh_token, google_token_expiry")
    .eq("user_id", user.id)
    .single();

  if (!business?.google_access_token) {
    return NextResponse.json({ error: "No hay token de Google guardado. Conecta primero." });
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(business as Parameters<typeof getValidAccessToken>[0]);
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener token válido", detail: String(err) });
  }

  let accounts: unknown[] = [];
  let accountsError: string | null = null;
  try {
    accounts = await getAccounts(accessToken);
  } catch (err) {
    accountsError = String(err);
  }

  const locationResults: Record<string, unknown> = {};
  for (const acc of accounts as Array<{ name: string }>) {
    try {
      const locs = await getLocations(accessToken, acc.name);
      locationResults[acc.name] = locs;
    } catch (err) {
      locationResults[acc.name] = { error: String(err) };
    }
  }

  return NextResponse.json({
    userId: user.id,
    accountsCount: accounts.length,
    accountsError,
    accounts,
    locations: locationResults,
  });
}
