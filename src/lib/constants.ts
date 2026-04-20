/**
 * Plantillas de mensajes de WhatsApp para ReseñasYa.
 *
 * Variables disponibles en las plantillas:
 *   {nombre}  → nombre del cliente
 *   {negocio} → nombre del negocio
 *   {url}     → enlace de Google Maps
 *
 * Para cambiar el texto de cualquier mensaje, edita directamente
 * la cadena correspondiente sin modificar las variables entre llaves.
 */

import type { BusinessTone } from "@/types";

// ---------------------------------------------------------------------------
// Estructura de plantillas por tono
// ---------------------------------------------------------------------------

export interface ToneTemplates {
  /** Se envía cuando el cliente ha dado una opinión positiva */
  positive: string;
  /** Se envía cuando el cliente ha dado una opinión negativa */
  negative: string;
  /** Se envía cuando la opinión del cliente es ambigua o neutral */
  neutral: string;
  /** Fallback cuando no hay URL de Google Maps configurada */
  fallback: string;
}

// ---------------------------------------------------------------------------
// Plantillas: Tuteo (trato informal de tú — por defecto)
// ---------------------------------------------------------------------------

const TUTEO: ToneTemplates = {
  positive: `¡Qué alegría saber eso, {nombre}! 🙌 Nos encanta que hayas tenido una buena experiencia en {negocio}.

¿Te animarías a dejar tu opinión en Google Maps? Con solo un minuto de tu tiempo ayudarías a más personas a encontrarnos:

👉 {url}

¡Muchas gracias de corazón! 💚`,

  negative: `Gracias por tu honestidad, {nombre}. Lamentamos que tu experiencia no haya sido la que esperabas 😔

En {negocio} tomamos muy en serio cada opinión. Si quieres contarnos qué ocurrió para poder mejorar, no dudes en responder a este mensaje.

Tu opinión es muy valiosa para nosotros. ¡Esperamos poder verte pronto y darte la experiencia que mereces! 🙏`,

  neutral: `Gracias por tu respuesta, {nombre} 😊 Nos alegra que hayas pasado por {negocio}.

Si quieres compartir tu experiencia en Google Maps, nos ayudaría mucho:

👉 {url}

¡Hasta pronto! 💚`,

  fallback: `¡Gracias por tu respuesta, {nombre}! 😊 Tu opinión es muy importante para {negocio}.`,
};

// ---------------------------------------------------------------------------
// Plantillas: Usted (trato formal)
// ---------------------------------------------------------------------------

const USTED: ToneTemplates = {
  positive: `¡Qué alegría saber eso, {nombre}! 🙌 Nos encanta que haya tenido una buena experiencia en {negocio}.

¿Se animaría a dejar su opinión en Google Maps? Con solo un minuto de su tiempo ayudaría a más personas a encontrarnos:

👉 {url}

¡Muchas gracias de corazón! 💚`,

  negative: `Gracias por su honestidad, {nombre}. Lamentamos que su experiencia no haya sido la que esperaba 😔

En {negocio} tomamos muy en serio cada opinión. Si quiere contarnos qué ocurrió para poder mejorar, no dude en responder a este mensaje.

Su opinión es muy valiosa para nosotros. ¡Esperamos poder atenderle pronto y darle la experiencia que merece! 🙏`,

  neutral: `Gracias por su respuesta, {nombre} 😊 Nos alegra que haya pasado por {negocio}.

Si quiere compartir su experiencia en Google Maps, nos ayudaría mucho:

👉 {url}

¡Hasta pronto! 💚`,

  fallback: `¡Gracias por su respuesta, {nombre}! 😊 Su opinión es muy importante para {negocio}.`,
};

// ---------------------------------------------------------------------------
// Plantillas: Juvenil (muy informal, desenfadado)
// ---------------------------------------------------------------------------

const JUVENIL: ToneTemplates = {
  positive: `¡Genial, {nombre}! 🔥 ¡Nos alegra un montón que te haya ido bien en {negocio}!

¿Nos echas una mano dejando una reseña en Google? ¡Nos ayuda muchísimo! 🙏

👉 {url}

¡Eres lo más! 💚✨`,

  negative: `Vaya, {nombre}, nos sabe muy mal que no haya ido bien 😕

En {negocio} queremos mejorar y tu opinión nos ayuda un montón. ¿Nos cuentas qué pasó? 💬

¡Ojalá podamos verte pronto y darte una experiencia mucho mejor! 🙌`,

  neutral: `¡Gracias por responder, {nombre}! 😊 ¡Mola que hayas pasado por {negocio}!

Si te apetece, puedes dejar tu opinión en Google, ¡nos ayuda un montón!

👉 {url}

¡Nos vemos pronto! 🙌`,

  fallback: `¡Gracias por responder, {nombre}! 😊 ¡Tu opinión nos ayuda un montón en {negocio}!`,
};

// ---------------------------------------------------------------------------
// Exportación del mapa completo de plantillas
// ---------------------------------------------------------------------------

export const MESSAGE_TEMPLATES: Record<BusinessTone, ToneTemplates> = {
  tuteo: TUTEO,
  usted: USTED,
  juvenil: JUVENIL,
};

// ---------------------------------------------------------------------------
// Mensaje de bienvenida por defecto (editable en Configuración)
// ---------------------------------------------------------------------------

export const DEFAULT_WELCOME_MESSAGE =
  "¡Hola {nombre}! Soy el equipo de {negocio}. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊";
