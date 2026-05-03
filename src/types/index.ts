// ---------------------------------------------------------------------------
// Enums / union types
// ---------------------------------------------------------------------------

/** Estado de una solicitud de reseña a lo largo de su ciclo de vida */
export type ReviewStatus =
  | "pending"              // enviada, esperando respuesta del cliente
  | "positive"             // respuesta positiva confirmada por la IA
  | "negative"             // respuesta negativa confirmada por la IA
  | "neutral"              // respuesta ambigua o sin opinión clara
  | "no_response"          // el cliente no respondió en el tiempo esperado
  | "awaiting_screenshot"  // incentivo activo: esperando captura de 5★
  | "rewarded";            // captura verificada y recompensa enviada

/** Tono de comunicación que el negocio quiere usar con sus clientes */
export type BusinessTone = "tuteo" | "usted" | "juvenil";

/** Tipo de código de descuento: generado aleatoriamente, extraído de un pool, o fijo siempre igual */
export type IncentiveCodeType = "random" | "pool" | "fixed";

/** Cuándo se comunica el incentivo al cliente */
export type IncentiveTiming = "initial" | "after_positive";

/** Modo de envío de WhatsApp del negocio */
export type WhatsAppMode = "shared" | "own" | "dedicated";

// ---------------------------------------------------------------------------
// Entidades de base de datos
// ---------------------------------------------------------------------------

/** Enlace a una plataforma de reseñas configurada por el negocio */
export interface ReviewPlatformLink {
  name: string;
  url: string;
  /** Código del acortador de URLs (6 chars). Undefined hasta que se guarda por primera vez. */
  shortCode?: string;
}

/** Negocio registrado en la plataforma (uno por usuario) */
export interface Business {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  /** URL de la plataforma de reseñas actualmente activa (se envía a los clientes) */
  google_maps_url: string | null;
  /** Todas las plataformas de reseñas configuradas */
  review_links: ReviewPlatformLink[];
  /** URL del logo del negocio (Clearbit o Supabase Storage) */
  logo_url: string | null;
  welcome_message: string;
  tone: BusinessTone;
  incentive_enabled: boolean;
  incentive_description: string | null;
  incentive_code_enabled: boolean;
  incentive_code_type: IncentiveCodeType;
  incentive_fixed_code: string | null;
  incentive_timing: IncentiveTiming;
  /** Modo de envío de WhatsApp: número compartido, propio o dedicado */
  whatsapp_mode: WhatsAppMode;
  own_twilio_account_sid: string | null;
  own_twilio_auth_token: string | null;
  own_twilio_whatsapp_number: string | null;
  /** Google Places ID para seguimiento automático de puntuación */
  google_place_id: string | null;
  created_at: string;
  updated_at: string;
}

/** Snapshot diario de la puntuación de un negocio en Google Maps */
export interface GoogleMapsSnapshot {
  id: string;
  business_id: string;
  place_id: string;
  rating: number | null;
  review_count: number | null;
  fetched_at: string;
}

/** Solicitud de reseña enviada a un cliente */
export interface ReviewRequest {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone: string;
  status: ReviewStatus;
  customer_response: string | null;
  sentiment_score: number | null;
  twilio_message_sid: string | null;
  follow_up_sent: boolean;
  discount_code: string | null;
  message_count: number;
  created_at: string;
  responded_at: string | null;
}

/**
 * ReviewRequest con datos del negocio incluidos (resultado de un JOIN).
 * Usado en el webhook para evitar una segunda consulta a la base de datos.
 */
export interface ReviewRequestWithBusiness extends ReviewRequest {
  businesses: Pick<Business, "name" | "google_maps_url" | "review_links" | "tone" | "incentive_enabled" | "incentive_description" | "incentive_code_enabled" | "incentive_code_type" | "incentive_fixed_code" | "whatsapp_mode" | "own_twilio_account_sid" | "own_twilio_auth_token" | "own_twilio_whatsapp_number">;
}

/** Código de descuento generado o subido por el negocio */
export interface DiscountCode {
  id: string;
  business_id: string;
  code: string;
  type: IncentiveCodeType;
  status: "available" | "used" | "expired";
  review_request_id: string | null;
  used_at: string | null;
  created_at: string;
}

/** Estadísticas agregadas de un negocio (vista business_stats de Supabase) */
export interface BusinessStats {
  business_id: string;
  user_id: string;
  total_requests: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  pending_count: number;
  no_response_count: number;
  /** Porcentaje de respuestas positivas sobre el total de respondidas (0–100) */
  positive_rate: number;
}

// ---------------------------------------------------------------------------
// Resultados de la IA
// ---------------------------------------------------------------------------

/** Resultado del análisis de sentimiento realizado por Claude */
export interface SentimentResult {
  sentiment: "positive" | "negative" | "neutral";
  /** Puntuación de positividad: 0.0 (muy negativo) → 1.0 (muy positivo) */
  score: number;
  /** Resumen breve de la opinión en español */
  summary: string;
}

/** Resultado del análisis de captura de pantalla de reseña de Google Maps */
export interface ScreenshotResult {
  isFiveStars: boolean;
  confidence: number;
  reason: string;
}
