import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { DEFAULT_WELCOME_MESSAGE } from "@/lib/constants";
import type { ReviewPlatformLink } from "@/types";

function generateShortCode(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function ensureShortCodes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  links: ReviewPlatformLink[],
  businessId: string
): Promise<ReviewPlatformLink[]> {
  const result: ReviewPlatformLink[] = [];
  for (const link of links) {
    if (link.shortCode) {
      await supabase.from("short_links").upsert({ code: link.shortCode, url: link.url, business_id: businessId });
      result.push(link);
    } else {
      let shortCode = "";
      for (let i = 0; i < 10 && !shortCode; i++) {
        const code = generateShortCode();
        const { error } = await supabase.from("short_links").insert({ code, url: link.url, business_id: businessId });
        if (!error) shortCode = code;
      }
      result.push({ ...link, shortCode: shortCode || undefined });
    }
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      website_url,
      google_maps_url,
      review_links,
      welcome_message,
      tone,
      incentive_enabled,
      incentive_description,
    } = body;

    const rawLinks: ReviewPlatformLink[] = Array.isArray(review_links) ? review_links : [];

    // Use service role to bypass PostgREST schema cache issues; user identity verified above
    const supabase = await createServiceClient();

    const { data: upserted, error: updateError } = await supabase
      .from("businesses")
      .upsert({
        user_id: user.id,
        name: String(name ?? "").trim() || "Mi negocio",
        description: String(description ?? "").trim() || null,
        website_url: String(website_url ?? "").trim() || null,
        google_maps_url: google_maps_url || null,
        review_links: rawLinks,
        welcome_message: String(welcome_message ?? "").trim() || DEFAULT_WELCOME_MESSAGE,
        tone: tone ?? "tuteo",
        incentive_enabled: Boolean(incentive_enabled),
        incentive_description: String(incentive_description ?? "").trim() || null,
      }, { onConflict: "user_id" })
      .select("id");

    if (updateError) {
      console.error("[ReseñasYa] Error al guardar configuración:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const businessId = Array.isArray(upserted) ? upserted[0]?.id : (upserted as { id: string } | null)?.id;

    // Generar códigos cortos en segundo plano (fallo silencioso)
    let allLinks = rawLinks;
    try {
      if (businessId) allLinks = await ensureShortCodes(supabase, rawLinks, businessId);
      if (businessId) {
        await supabase
          .from("businesses")
          .update({ review_links: allLinks })
          .eq("id", businessId);
      }
    } catch {
      // short_links table might not exist yet
    }

    return NextResponse.json({ success: true, review_links: allLinks });
  } catch (err) {
    console.error("[ReseñasYa] Error inesperado en /api/configuracion:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
