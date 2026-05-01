import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { DEFAULT_WELCOME_MESSAGE } from "@/lib/constants";
import type { ReviewPlatformLink } from "@/types";

function generateShortCode(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function ensureShortCodes(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
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

    const supabase = await createServiceClient();

    const payload = {
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
    };

    // Check whether the row already exists
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    let businessId: string | undefined;

    if (existing?.id) {
      // UPDATE existing row
      const { error } = await supabase
        .from("businesses")
        .update(payload)
        .eq("user_id", user.id);
      if (error) {
        console.error("[ReseñasYa] Error al actualizar configuración:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      businessId = existing.id;
    } else {
      // INSERT new row
      const { data: inserted, error } = await supabase
        .from("businesses")
        .insert(payload)
        .select("id")
        .maybeSingle();
      if (error) {
        console.error("[ReseñasYa] Error al crear negocio:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      businessId = inserted?.id;
    }

    // Generate short codes silently
    let allLinks = rawLinks;
    try {
      if (businessId) {
        allLinks = await ensureShortCodes(supabase, rawLinks, businessId);
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
