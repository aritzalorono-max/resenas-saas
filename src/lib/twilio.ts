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
// Envío de mensajes
// ---------------------------------------------------------------------------

/**
 * Envía un mensaje de texto por WhatsApp usando Twilio.
 *
 * @param to   - Número de teléfono del destinatario (con o sin prefijo internacional)
 * @param body - Texto del mensaje a enviar
 * @returns SID del mensaje creado en Twilio (útil para trazabilidad)
 * @throws Si Twilio rechaza el mensaje (número inválido, sandbox no configurado, etc.)
 */
export async function sendWhatsAppMessage(to: string, body: string): Promise<string> {
  const message = await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_NUMBER,
    to: formatWhatsAppNumber(to),
    body,
  });

  return message.sid;
}
