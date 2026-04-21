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

// ---------------------------------------------------------------------------
// Entidades de base de datos
// ---------------------------------------------------------------------------

/** Enlace a una plataforma de reseñas configurada por el negocio */
export interface ReviewPlatformLink {
  name: string;
  url: string;
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
  welcome_message: string;
  tone: BusinessTone;
  incentive_enabled: boolean;
  incentive_description: string | null;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  responded_at: string | null;
}

/**
 * ReviewRequest con datos del negocio incluidos (resultado de un JOIN).
 * Usado en el webhook para evitar una segunda consulta a la base de datos.
 */
export interface ReviewRequestWithBusiness extends ReviewRequest {
  businesses: Pick<Business, "name" | "google_maps_url" | "review_links" | "tone" | "incentive_enabled" | "incentive_description">;
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
