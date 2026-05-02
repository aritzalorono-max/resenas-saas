/**
 * Construcción de mensajes de seguimiento de WhatsApp.
 *
 * Este módulo es responsable únicamente de combinar las plantillas
 * de /lib/constants.ts con los datos del negocio y del cliente.
 * No contiene lógica de IA ni llamadas a APIs externas.
 */

import { MESSAGE_TEMPLATES } from "@/lib/constants";
import type { BusinessTone } from "@/types";

// ---------------------------------------------------------------------------
// Helper interno: reemplaza las variables en una plantilla
// ---------------------------------------------------------------------------

interface TemplateVars {
  nombre?: string;
  negocio?: string;
  url?: string;
  incentivo?: string;
  plataforma?: string;
}

function applyTemplate(template: string, vars: TemplateVars): string {
  return template
    .replace(/{nombre}/g, vars.nombre ?? "")
    .replace(/{negocio}/g, vars.negocio ?? "")
    .replace(/{url}/g, vars.url ?? "")
    .replace(/{incentivo}/g, vars.incentivo ?? "")
    .replace(/{plataforma}/g, vars.plataforma ?? "");
}

// ---------------------------------------------------------------------------
// Mensajes de seguimiento según el sentimiento detectado
// ---------------------------------------------------------------------------

/**
 * Mensaje de agradecimiento + enlace a Google Maps.
 * Solo se llama cuando la opinión fue positiva Y hay URL configurada.
 */
export function buildPositiveFollowUp(
  customerName: string,
  businessName: string,
  reviewUrl: string,
  tone: BusinessTone = "tuteo",
  platformName = "Google Maps"
): string {
  return applyTemplate(MESSAGE_TEMPLATES[tone].positive, {
    nombre: customerName,
    negocio: businessName,
    url: reviewUrl,
    plataforma: platformName,
  });
}

/**
 * Mensaje empático sin enlace a Google Maps.
 * Se llama cuando la opinión fue negativa para proteger la reputación del negocio.
 */
export function buildNegativeFollowUp(
  customerName: string,
  businessName: string,
  tone: BusinessTone = "tuteo"
): string {
  return applyTemplate(MESSAGE_TEMPLATES[tone].negative, {
    nombre: customerName,
    negocio: businessName,
  });
}

/**
 * Mensaje de agradecimiento + enlace suave a Google Maps.
 * Se llama cuando la opinión es ambigua o neutral.
 */
export function buildNeutralFollowUp(
  customerName: string,
  businessName: string,
  reviewUrl: string,
  tone: BusinessTone = "tuteo",
  platformName = "Google Maps"
): string {
  return applyTemplate(MESSAGE_TEMPLATES[tone].neutral, {
    nombre: customerName,
    negocio: businessName,
    url: reviewUrl,
    plataforma: platformName,
  });
}

/**
 * Mensaje de agradecimiento genérico cuando no hay URL de Google Maps.
 * Fallback para cualquier sentimiento cuando el negocio aún no ha configurado su enlace.
 */
export function buildFallbackFollowUp(
  customerName: string,
  businessName: string,
  tone: BusinessTone = "tuteo"
): string {
  return applyTemplate(MESSAGE_TEMPLATES[tone].fallback, {
    nombre: customerName,
    negocio: businessName,
  });
}

/**
 * Punto de entrada unificado: elige el mensaje correcto según sentimiento y configuración.
 * Cuando hay incentivo activo y el sentimiento es positivo, usa positive_incentive en su lugar.
 */
export function buildFollowUpMessage(params: {
  customerName: string;
  businessName: string;
  googleMapsUrl: string | null;
  sentiment: "positive" | "negative" | "neutral";
  tone: BusinessTone;
  platformName?: string;
  incentiveEnabled?: boolean;
  incentiveDescription?: string | null;
  discountCode?: string | null;
}): string {
  const {
    customerName, businessName, googleMapsUrl, sentiment, tone,
    platformName = "Google Maps", incentiveEnabled, incentiveDescription, discountCode,
  } = params;

  if (sentiment === "positive" && googleMapsUrl && incentiveEnabled && incentiveDescription) {
    return buildIncentiveFollowUp(customerName, businessName, googleMapsUrl, incentiveDescription, tone, platformName);
  }

  if (sentiment === "positive" && googleMapsUrl) {
    return buildPositiveFollowUp(customerName, businessName, googleMapsUrl, tone, platformName);
  }

  if (sentiment === "negative") {
    return buildNegativeFollowUp(customerName, businessName, tone);
  }

  if (googleMapsUrl) {
    return buildNeutralFollowUp(customerName, businessName, googleMapsUrl, tone, platformName);
  }

  return buildFallbackFollowUp(customerName, businessName, tone);
}

/**
 * Mensaje con oferta de incentivo: pide reseña 5★ + captura de pantalla.
 * Se usa cuando el negocio tiene el incentivo activo y la opinión es positiva.
 */
export function buildIncentiveFollowUp(
  customerName: string,
  businessName: string,
  reviewUrl: string,
  incentiveDescription: string,
  tone: BusinessTone = "tuteo",
  platformName = "Google Maps",
): string {
  return applyTemplate(MESSAGE_TEMPLATES[tone].positive_incentive, {
    nombre: customerName,
    negocio: businessName,
    url: reviewUrl,
    incentivo: incentiveDescription,
    plataforma: platformName,
  });
}

/**
 * Mensaje de confirmación cuando la captura muestra la puntuación máxima verificada.
 */
export function buildScreenshotVerifiedMessage(
  customerName: string,
  businessName: string,
  incentiveDescription: string,
  tone: BusinessTone = "tuteo",
  platformName = "Google Maps",
  discountCode?: string | null
): string {
  const incentivo = discountCode
    ? `${incentiveDescription} — código *${discountCode}*`
    : incentiveDescription;
  return applyTemplate(MESSAGE_TEMPLATES[tone].screenshot_verified, {
    nombre: customerName,
    negocio: businessName,
    incentivo,
    plataforma: platformName,
  });
}

/**
 * Mensaje pidiendo una captura más clara cuando no se pueden ver las 5★.
 */
export function buildScreenshotRetryMessage(
  customerName: string,
  tone: BusinessTone = "tuteo"
): string {
  return applyTemplate(MESSAGE_TEMPLATES[tone].screenshot_retry, {
    nombre: customerName,
  });
}
