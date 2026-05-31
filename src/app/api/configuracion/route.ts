import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { DEFAULT_WELCOME_MESSAGE } from "@/lib/constants";
import { validateUrl } from "@/lib/validation";
import { extractPlaceIdFromUrl } from "@/lib/google-places";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import type { ReviewPlatformLink, BusinessTone, WhatsAppLanguage, WhatsAppMode } from "@/types";

const VALID_TONES: BusinessTone[] = ["tuteo", "usted", "juvenil"];
const VALID_WHATSAPP_MODES: WhatsAppMode[] = ["shared", "own", "dedicated"];
const VALID_LANGUAGES: WhatsAppLanguage[] = ["es", "en", "fr", "de", "it", "pt"];
const WELCOME_MESSAGE_MAX = 1000;

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

    // 10 config saves per minute per user
    const rateSvc = await createServiceClient();
    const rl = await checkGeneralRateLimit(rateSvc, `configuracion:${user.id}`, 1, 10);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
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
      whatsapp_language,
      whatsapp_mode,
      reminder_max_count,
      own_twilio_account_sid,
      own_twilio_auth_token,
      own_twilio_whatsapp_number,
    } = body;

    // Validate tone
    const safeTone: BusinessTone = VALID_TONES.includes(tone) ? tone : "tuteo";

    // Validate whatsapp_language
    const safeLanguage: WhatsAppLanguage = VALID_LANGUAGES.includes(whatsapp_language) ? whatsapp_language : "es";

    // Validate whatsapp_mode
    const safeMode: WhatsAppMode = VALID_WHATSAPP_MODES.includes(whatsapp_mode) ? whatsapp_mode : "shared";

    // Validate welcome_message length
    const safeWelcome = String(welcome_message ?? "").trim().slice(0, WELCOME_MESSAGE_MAX) || DEFAULT_WELCOME_MESSAGE;

    // Validate review_links URLs
    const rawLinks: ReviewPlatformLink[] = [];
    if (Array.isArray(review_links)) {
      for (const link of review_links) {
        if (typeof link !== "object" || !link) continue;
        const urlResult = validateUrl(link.url);
        if (!urlResult.valid) {
          return NextResponse.json({ error: `URL inválida en plataforma "${link.name}": ${urlResult.error}` }, { status: 400 });
        }
        rawLinks.push({ ...link, url: urlResult.sanitized ?? link.url });
      }
    }

    const supabase = await createServiceClient();

    // Incentive fields are managed by the /incentivos page — don't touch them here
    const payload = {
      user_id: user.id,
      name: String(name ?? "").trim().slice(0, 200) || "Mi negocio",
      description: String(description ?? "").trim().slice(0, 500) || null,
      website_url: String(website_url ?? "").trim() || null,
      google_maps_url: google_maps_url || null,
      review_links: rawLinks,
      welcome_message: safeWelcome,
      tone: safeTone,
      whatsapp_language: safeLanguage,
      whatsapp_mode: safeMode,
      reminder_max_count: [0, 1, 2].includes(Number(reminder_max_count)) ? Number(reminder_max_count) : 2,
      own_twilio_account_sid: safeMode === "own" ? (String(own_twilio_account_sid ?? "").trim() || null) : null,
      own_twilio_auth_token:  safeMode === "own" ? (String(own_twilio_auth_token ?? "").trim() || null) : null,
      own_twilio_whatsapp_number: safeMode === "own" ? (String(own_twilio_whatsapp_number ?? "").trim() || null) : null,
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
        logger.error("Error al actualizar configuración", error);
        return NextResponse.json({ error: "Error al guardar la configuración. Por favor, inténtalo de nuevo." }, { status: 500 });
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
        logger.error("Error al crear negocio", error);
        return NextResponse.json({ error: "Error al guardar la configuración. Por favor, inténtalo de nuevo." }, { status: 500 });
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

    // Resolve Google Place ID from the Maps URL (silently, best-effort)
    const mapsUrl = payload.google_maps_url;
    if (businessId && mapsUrl && process.env.GOOGLE_PLACES_API_KEY) {
      try {
        const placeId = await extractPlaceIdFromUrl(mapsUrl);
        if (placeId) {
          const service = await createServiceClient();
          await service.from("businesses").update({ google_place_id: placeId }).eq("id", businessId);
          logger.info(`Place ID resuelto al guardar config: ${placeId}`);
        }
      } catch {
        // non-critical
      }
    }

    return NextResponse.json({ success: true, review_links: allLinks });
  } catch (err) {
    logger.error("Error inesperado en /api/configuracion", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
