/**
 * Integración con la API de Twilio para el envío de mensajes de WhatsApp.
 *
 * Este módulo es responsable únicamente de la comunicación con Twilio.
 * El contenido de los mensajes se construye en /lib/messages.ts.
 */

import twilio from "twilio";

// ---------------------------------------------------------------------------
// Inicialización del cliente de Twilio
// ---------------------------------------------------------------------------

/** Cliente de Twilio inicializado con las credenciales del entorno */
export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

/** Número de WhatsApp de Twilio desde el que se envían los mensajes */
export const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER!;

// ---------------------------------------------------------------------------
// Utilidades de formato de número de teléfono
// ---------------------------------------------------------------------------

/**
 * Convierte un número de teléfono al formato que requiere Twilio para WhatsApp.
 *
 * Ejemplos:
 *   "612345678"      → "whatsapp:+612345678"
 *   "+34612345678"   → "whatsapp:+34612345678"
 *   "034612345678"   → "whatsapp:+34612345678"
 *
 * @param phone - Número de teléfono en cualquier formato
 * @returns Número formateado con el prefijo "whatsapp:" que requiere Twilio
 */
export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  // Si empieza por 0 (ej: 0034...) quitamos el cero y añadimos +
  if (cleaned.startsWith("0")) {
    return `whatsapp:+${cleaned.slice(1)}`;
  }

  // Si ya tiene prefijo +, solo añadimos el protocolo
  if (phone.trim().startsWith("+")) {
    return `whatsapp:+${cleaned}`;
  }

  return `whatsapp:+${cleaned}`;
}

/**
 * Normaliza el número "From" que Twilio incluye en el webhook.
 * Twilio lo envía como "whatsapp:+34612345678", y devolvemos variantes
 * para maximizar la coincidencia con el número guardado en la base de datos.
 *
 * @param fromField - Valor del campo "From" del webhook de Twilio
 * @returns Array de variantes del número para buscar en la BD
 */
export function getPhoneVariants(fromField: string): string[] {
  const normalized = fromField.replace("whatsapp:", "").replace(/\s/g, "");

  return [
    normalized,                                  // ej: +34612345678
    normalized.replace(/^\+\d{2}/, ""),          // sin prefijo de país (2 dígitos)
    normalized.replace(/^\+\d{1,3}/, ""),        // sin prefijo de país (1-3 dígitos)
    normalized.replace("+", ""),                  // sin el +
  ].filter((v, i, arr) => arr.indexOf(v) === i); // eliminamos duplicados
}

// ---------------------------------------------------------------------------
// Selección de cliente según el modo del negocio
// ---------------------------------------------------------------------------

interface BusinessWhatsAppConfig {
  whatsapp_mode?: string | null;
  own_twilio_account_sid?: string | null;
  own_twilio_auth_token?: string | null;
  own_twilio_whatsapp_number?: string | null;
}

/**
 * Devuelve el cliente Twilio y el número de origen correctos para un negocio.
 * - shared / dedicated: usa las credenciales globales de la plataforma.
 * - own: usa las credenciales propias del negocio si están completas.
 */
export function getTwilioSender(business: BusinessWhatsAppConfig): {
  client: ReturnType<typeof twilio>;
  fromNumber: string;
} {
  if (
    business.whatsapp_mode === "own" &&
    business.own_twilio_account_sid &&
    business.own_twilio_auth_token &&
    business.own_twilio_whatsapp_number
  ) {
    return {
      client: twilio(business.own_twilio_account_sid, business.own_twilio_auth_token),
      fromNumber: formatWhatsAppNumber(business.own_twilio_whatsapp_number),
    };
  }
  return { client: twilioClient, fromNumber: TWILIO_WHATSAPP_NUMBER };
}

// ---------------------------------------------------------------------------
// Envío de mensajes
// ---------------------------------------------------------------------------

/**
 * Envía un WhatsApp usando el cliente compartido de la plataforma (modo shared).
 */
export async function sendWhatsAppMessage(to: string, body: string): Promise<string> {
  const message = await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_NUMBER,
    to: formatWhatsAppNumber(to),
    body,
  });
  return message.sid;
}

/**
 * Envía un WhatsApp usando un cliente y número de origen explícitos.
 * Usado cuando el negocio tiene su propio número de Twilio.
 */
export async function sendWhatsAppMessageWith(
  client: ReturnType<typeof twilio>,
  fromNumber: string,
  to: string,
  body: string
): Promise<string> {
  const message = await client.messages.create({
    from: fromNumber,
    to: formatWhatsAppNumber(to),
    body,
  });
  return message.sid;
}
