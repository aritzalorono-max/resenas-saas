import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gift } from "lucide-react";
import { buildFollowUpMessage, buildIncentiveFollowUp } from "@/lib/messages";
import type { ReviewRequest, Business } from "@/types";

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  pending:             { label: "Pendiente",      badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400"   },
  positive:            { label: "Positiva",       badge: "bg-green-100 text-green-700",   dot: "bg-green-500"   },
  negative:            { label: "Negativa",       badge: "bg-red-100 text-red-600",       dot: "bg-red-400"     },
  neutral:             { label: "Neutral",        badge: "bg-gray-100 text-gray-600",     dot: "bg-gray-400"    },
  no_response:         { label: "Sin respuesta",  badge: "bg-gray-100 text-gray-500",     dot: "bg-gray-300"    },
  awaiting_screenshot: { label: "Esp. captura",   badge: "bg-purple-100 text-purple-700", dot: "bg-purple-400"  },
  rewarded:            { label: "Recompensado",   badge: "bg-brand-100 text-brand-700",   dot: "bg-brand-500"   },
};

function fmt(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    ...opts,
  });
}

// Bubble: message sent by the bot (right side, green)
function BotBubble({ text, time }: { text: string; time?: string }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="max-w-[85%] sm:max-w-[70%]">
        <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{text}</p>
        </div>
        {time && <p className="text-xs text-gray-400 text-right mt-1 pr-1">{time}</p>}
      </div>
    </div>
  );
}

// Bubble: message sent by the customer (left side, white)
function CustomerBubble({ text, time }: { text: string; time?: string }) {
  return (
    <div className="flex justify-start mb-2">
      <div className="max-w-[85%] sm:max-w-[70%]">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{text}</p>
        </div>
        {time && <p className="text-xs text-gray-400 mt-1 pl-1">{time}</p>}
      </div>
    </div>
  );
}

export default async function ResenasDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const businessResult = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user!.id)
    .single();
  const business = (businessResult.data ?? null) as Business | null;

  if (!business) notFound();

  const reqResult = await supabase
    .from("review_requests")
    .select("*")
    .eq("id", id)
    .eq("business_id", business.id)
    .single();
  const req = (reqResult.data ?? null) as ReviewRequest | null;

  if (!req) notFound();

  const config = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
  const tone = business.tone ?? "tuteo";

  // ── Reconstruct conversation messages ─────────────────────────────────────

  // 1. Welcome message sent to the customer
  const welcomeMsg = (business.welcome_message ?? "")
    .replace(/\{nombre\}/g, req.customer_name)
    .replace(/\{negocio\}/g,  business.name);

  // 2. Follow-up message sent by the bot
  let followUpMsg = "";
  if (req.follow_up_sent && req.customer_response) {
    const activeLink   = business.review_links?.find((l) => l.url === business.google_maps_url);
    const platformName = activeLink?.name ?? "Google Maps";
    const reviewUrl    = business.google_maps_url ?? "";

    const isIncentiveFlow = ["awaiting_screenshot", "rewarded"].includes(req.status);
    const resolvedSentiment = isIncentiveFlow
      ? "positive"
      : (req.status as "positive" | "negative" | "neutral");

    if (isIncentiveFlow && business.incentive_enabled && business.incentive_description && reviewUrl) {
      followUpMsg = buildIncentiveFollowUp(
        req.customer_name,
        business.name,
        reviewUrl,
        business.incentive_description,
        tone,
        platformName,
      );
    } else if (["positive", "negative", "neutral"].includes(resolvedSentiment)) {
      followUpMsg = buildFollowUpMessage({
        customerName:        req.customer_name,
        businessName:        business.name,
        googleMapsUrl:       reviewUrl || null,
        sentiment:           resolvedSentiment as "positive" | "negative" | "neutral",
        tone,
        platformName,
        incentiveEnabled:    business.incentive_enabled,
        incentiveDescription: business.incentive_description,
        discountCode:        req.discount_code,
      });
    }
  }

  // 3. Screenshot pending / rewarded closing message
  const screenshotRequestMsg =
    req.status === "awaiting_screenshot"
      ? `Cuando publiques tu reseña de 5 ⭐, envíanos una captura de pantalla y te enviamos tu regalo 🎁`
      : null;

  const rewardedMsg =
    req.status === "rewarded" && req.discount_code
      ? `¡Hemos verificado tu reseña de 5 ⭐! Aquí tienes tu regalo: *${req.discount_code}* 🎁\n\n¡Muchas gracias por confiar en ${business.name}! 💚`
      : req.status === "rewarded"
      ? `¡Hemos verificado tu reseña de 5 ⭐! Gracias por confiar en ${business.name} 💚`
      : null;

  const sentimentLabel =
    req.sentiment_score == null ? null :
    req.sentiment_score >= 0.6  ? "Positivo" :
    req.sentiment_score >= 0.4  ? "Neutral"  : "Negativo";

  const sentimentColor =
    req.sentiment_score == null ? "text-gray-400" :
    req.sentiment_score >= 0.6  ? "text-green-600" :
    req.sentiment_score >= 0.4  ? "text-gray-500"  : "text-red-500";

  const scoreBarColor =
    req.sentiment_score == null ? "bg-gray-300" :
    req.sentiment_score >= 0.6  ? "bg-green-500" :
    req.sentiment_score >= 0.4  ? "bg-gray-400"  : "bg-red-400";

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Back */}
      <Link
        href="/resenas"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a reseñas
      </Link>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-gray-900">{req.customer_name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{req.customer_phone}</p>
            <p className="text-xs text-gray-400 mt-0.5">Enviado: {fmt(req.created_at)}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>

        {/* Sentiment score */}
        {req.sentiment_score != null && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Sentimiento analizado por IA</span>
              <span className={`text-xs font-semibold ${sentimentColor}`}>
                {sentimentLabel} · {(req.sentiment_score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${scoreBarColor}`}
                style={{ width: `${req.sentiment_score * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Discount code */}
        {req.discount_code && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <Gift className="w-4 h-4 text-brand-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Código de incentivo asignado</p>
              <p className="text-sm font-bold text-brand-700">{req.discount_code}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Conversación ───────────────────────────────────────────────────── */}
      <div className="bg-[#e5ddd5] rounded-2xl overflow-hidden shadow-card">
        {/* WhatsApp-style header */}
        <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {req.customer_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{req.customer_name}</p>
            <p className="text-xs text-white/70">{req.customer_phone}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-1 min-h-[200px]">
          {/* 1. Welcome message */}
          {welcomeMsg && (
            <BotBubble text={welcomeMsg} time={fmt(req.created_at)} />
          )}

          {/* 2. Customer response */}
          {req.customer_response ? (
            <CustomerBubble
              text={req.customer_response}
              time={req.responded_at ? fmt(req.responded_at) : undefined}
            />
          ) : req.status === "no_response" ? (
            <div className="text-center py-4">
              <span className="text-xs bg-white/60 text-gray-500 px-3 py-1.5 rounded-full">
                El cliente no respondió
              </span>
            </div>
          ) : (
            <div className="text-center py-4">
              <span className="text-xs bg-white/60 text-amber-600 px-3 py-1.5 rounded-full">
                Esperando respuesta del cliente…
              </span>
            </div>
          )}

          {/* 3. Bot follow-up */}
          {followUpMsg && (
            <BotBubble
              text={followUpMsg}
              time={req.responded_at ? fmt(req.responded_at) : undefined}
            />
          )}

          {/* 4. Multi-turn indicator */}
          {req.message_count > 0 && (
            <div className="text-center py-2">
              <span className="text-xs bg-white/60 text-gray-500 px-3 py-1.5 rounded-full">
                {req.message_count} mensaje{req.message_count !== 1 ? "s" : ""} adicional{req.message_count !== 1 ? "es" : ""} en la conversación
              </span>
            </div>
          )}

          {/* 5. Screenshot requested (awaiting) */}
          {screenshotRequestMsg && (
            <BotBubble text={screenshotRequestMsg} />
          )}

          {/* 6. Reward sent */}
          {rewardedMsg && (
            <BotBubble text={rewardedMsg} />
          )}
        </div>
      </div>
    </div>
  );
}
