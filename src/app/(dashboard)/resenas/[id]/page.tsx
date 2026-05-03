import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { ReviewRequest } from "@/types";
import {
  ArrowLeft, Send, MessageSquare, Star, Gift,
  CheckCircle2, Clock, Camera, Award,
} from "lucide-react";

const STATUS_CONFIG = {
  pending:             { label: "Pendiente",      badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400"   },
  positive:            { label: "Positiva",       badge: "bg-green-100 text-green-700",   dot: "bg-green-500"   },
  negative:            { label: "Negativa",       badge: "bg-red-100 text-red-600",       dot: "bg-red-400"     },
  neutral:             { label: "Neutral",        badge: "bg-gray-100 text-gray-600",     dot: "bg-gray-400"    },
  no_response:         { label: "Sin respuesta",  badge: "bg-gray-100 text-gray-500",     dot: "bg-gray-300"    },
  awaiting_screenshot: { label: "Esp. captura",   badge: "bg-purple-100 text-purple-700", dot: "bg-purple-400"  },
  rewarded:            { label: "Recompensado",   badge: "bg-brand-100 text-brand-700",   dot: "bg-brand-500"   },
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function TimelineItem({
  iconBg,
  icon,
  title,
  date,
  children,
  last = false,
}: {
  iconBg: string;
  icon: ReactNode;
  title: string;
  date?: string;
  children?: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex gap-3 ${last ? "" : "pb-5"}`}>
      {/* Icon + vertical line */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        {!last && <div className="w-px flex-1 bg-gray-100 mt-2" />}
      </div>
      {/* Content */}
      <div className={`flex-1 ${last ? "" : "pb-1"}`}>
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{title}</p>
          {date && <span className="text-xs text-gray-400 shrink-0 mt-0.5">{date}</span>}
        </div>
        {children}
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

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  const { data: req } = await supabase
    .from("review_requests")
    .select("*")
    .eq("id", id)
    .eq("business_id", business?.id ?? "")
    .single() as { data: ReviewRequest | null };

  if (!req) notFound();

  const config = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;

  const scoreColor =
    req.sentiment_score == null   ? "bg-gray-300" :
    req.sentiment_score >= 0.6    ? "bg-green-500" :
    req.sentiment_score >= 0.4    ? "bg-gray-400"  : "bg-red-400";

  const scoreLabel =
    req.sentiment_score == null   ? null :
    req.sentiment_score >= 0.6    ? "Positivo" :
    req.sentiment_score >= 0.4    ? "Neutral"  : "Negativo";

  const scoreLabelColor =
    req.sentiment_score == null   ? "text-gray-400" :
    req.sentiment_score >= 0.6    ? "text-green-600" :
    req.sentiment_score >= 0.4    ? "text-gray-500"  : "text-red-500";

  // Build timeline steps
  const isTerminal = !["pending"].includes(req.status);
  const hasResponse = !!req.customer_response;
  const hasScore = req.sentiment_score != null;
  const isAwaitingOrRewarded = ["awaiting_screenshot", "rewarded"].includes(req.status);
  const isRewarded = req.status === "rewarded";

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
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 shadow-card">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{req.customer_name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{req.customer_phone}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Solicitud enviada el {formatDate(req.created_at)}
        </p>

        {/* Sentiment bar */}
        {req.sentiment_score != null && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Sentimiento analizado por IA</span>
              <span className={`text-xs font-semibold ${scoreLabelColor}`}>
                {scoreLabel} · {(req.sentiment_score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${scoreColor}`}
                style={{ width: `${req.sentiment_score * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Discount code highlight */}
        {req.discount_code && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <Gift className="w-4 h-4 text-brand-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Código de incentivo</p>
              <p className="text-sm font-bold text-brand-700">{req.discount_code}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Timeline ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">
          Historial de la conversación
        </h2>

        {/* 1. Solicitud enviada */}
        <TimelineItem
          iconBg="bg-brand-500"
          icon={<Send className="w-4 h-4 text-white" />}
          title="WhatsApp enviado"
          date={formatDate(req.created_at)}
          last={!hasResponse && !isTerminal}
        >
          <p className="text-xs text-gray-400 mt-1">
            Se envió el mensaje de solicitud de reseña al cliente.
          </p>
        </TimelineItem>

        {/* 2. Respuesta o sin respuesta */}
        {hasResponse ? (
          <TimelineItem
            iconBg="bg-gray-700"
            icon={<MessageSquare className="w-4 h-4 text-white" />}
            title="Respuesta del cliente"
            date={req.responded_at ? formatDate(req.responded_at) : undefined}
            last={!hasScore && !req.follow_up_sent}
          >
            <blockquote className="mt-2 text-sm text-gray-700 italic bg-gray-50 border-l-2 border-gray-300 pl-3 py-1.5 rounded-r-lg leading-relaxed">
              &ldquo;{req.customer_response}&rdquo;
            </blockquote>
          </TimelineItem>
        ) : req.status === "no_response" ? (
          <TimelineItem
            iconBg="bg-gray-300"
            icon={<Clock className="w-4 h-4 text-white" />}
            title="Sin respuesta"
            last
          >
            <p className="text-xs text-gray-400 mt-1">El cliente no respondió.</p>
          </TimelineItem>
        ) : (
          <TimelineItem
            iconBg="bg-amber-400"
            icon={<Clock className="w-4 h-4 text-white" />}
            title="Esperando respuesta"
            last
          >
            <p className="text-xs text-gray-400 mt-1">Aún no ha respondido.</p>
          </TimelineItem>
        )}

        {/* 3. Análisis IA */}
        {hasScore && (
          <TimelineItem
            iconBg="bg-violet-500"
            icon={<Star className="w-4 h-4 text-white" />}
            title="Análisis de sentimiento (IA)"
            last={!req.follow_up_sent}
          >
            <p className="text-xs text-gray-500 mt-1">
              Clasificado como{" "}
              <span className={`font-semibold ${scoreLabelColor}`}>{scoreLabel}</span>
              {" "}con un score de{" "}
              <span className="font-semibold">{(req.sentiment_score! * 100).toFixed(0)}%</span>.
            </p>
          </TimelineItem>
        )}

        {/* 4. Seguimiento enviado */}
        {req.follow_up_sent && (
          <TimelineItem
            iconBg="bg-green-500"
            icon={<CheckCircle2 className="w-4 h-4 text-white" />}
            title="Mensaje de seguimiento enviado"
            last={!isAwaitingOrRewarded}
          >
            <p className="text-xs text-gray-400 mt-1">
              Se envió la respuesta automática adaptada al sentimiento.
            </p>
          </TimelineItem>
        )}

        {/* 5. Esperando captura */}
        {req.status === "awaiting_screenshot" && (
          <TimelineItem
            iconBg="bg-purple-500"
            icon={<Camera className="w-4 h-4 text-white" />}
            title="Esperando captura de reseña"
            last
          >
            <p className="text-xs text-gray-400 mt-1">
              Se pidió al cliente una captura de su reseña de 5★.
            </p>
          </TimelineItem>
        )}

        {/* 6. Recompensado */}
        {isRewarded && (
          <TimelineItem
            iconBg="bg-brand-500"
            icon={<Award className="w-4 h-4 text-white" />}
            title="Recompensa enviada"
            last
          >
            <p className="text-xs text-gray-400 mt-1">
              La reseña de 5★ fue verificada y el incentivo fue enviado al cliente.
            </p>
            {req.discount_code && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-brand-50 border border-brand-100 rounded-xl px-3 py-1.5">
                <Gift className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-sm font-bold text-brand-700">{req.discount_code}</span>
              </div>
            )}
          </TimelineItem>
        )}
      </div>
    </div>
  );
}
