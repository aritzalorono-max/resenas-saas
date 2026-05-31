/**
 * Plantillas de mensajes de WhatsApp para ResenasYa.
 *
 * Variables disponibles en las plantillas:
 *   {nombre}    → nombre del cliente
 *   {negocio}   → nombre del negocio
 *   {url}       → enlace a la plataforma de reseñas activa
 *   {plataforma}→ nombre de la plataforma activa (Google Maps, Trustpilot, etc.)
 *   {incentivo} → descripción del incentivo del negocio
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
  /** Se envía cuando hay incentivo activo y la opinión es positiva: pide reseña 5★ + captura */
  positive_incentive: string;
  /** Se envía cuando la captura de pantalla confirma 5 estrellas */
  screenshot_verified: string;
  /** Se envía cuando la captura no muestra claramente 5 estrellas */
  screenshot_retry: string;
  /** Mensaje de cierre cuando se alcanza el límite de 7 mensajes en conversación multi-turno */
  conversation_closing: string;
}

// ---------------------------------------------------------------------------
// Plantillas: Tuteo (trato informal de tú — por defecto)
// ---------------------------------------------------------------------------

const TUTEO: ToneTemplates = {
  positive: `¡Qué alegría saber eso, {nombre}! 🙌 Nos encanta que hayas tenido una buena experiencia en {negocio}.

¿Te animarías a dejarnos una reseña en {plataforma}? Con solo un minuto de tu tiempo ayudarías a más personas a encontrarnos:

👉 {url}

¡Muchas gracias de corazón! 💚`,

  negative: `Gracias por tu honestidad, {nombre}. Lamentamos que tu experiencia no haya sido la que esperabas 😔

En {negocio} tomamos muy en serio cada opinión. Si quieres contarnos qué ocurrió para poder mejorar, no dudes en responder a este mensaje.

Tu opinión es muy valiosa para nosotros. ¡Esperamos poder verte pronto y darte la experiencia que mereces! 🙏`,

  neutral: `Gracias por tu respuesta, {nombre} 😊 Nos alegra que hayas pasado por {negocio}.

Si quieres compartir tu experiencia en {plataforma}, nos ayudaría mucho:

👉 {url}

¡Hasta pronto! 💚`,

  fallback: `¡Gracias por tu respuesta, {nombre}! 😊 Tu opinión es muy importante para {negocio}.`,

  positive_incentive: `¡Qué alegría saber eso, {nombre}! 🙌 Nos encanta que hayas tenido una gran experiencia en {negocio}.

¿Te animarías a dejarnos una reseña en {plataforma}? Es muy sencillo:

👉 {url}

Y como agradecimiento por tu tiempo, tu regalo: *{incentivo}* 🎁

Cuando publiques tu reseña, mándanos una captura de pantalla y te lo enviamos enseguida. ¡Muchas gracias! 💚`,

  screenshot_verified: `¡Muchísimas gracias, {nombre}! 🎉 Hemos comprobado tu reseña en {plataforma}.

Como prometimos, aquí tienes tu regalo: *{incentivo}* 🎁

¡Gracias por confiar en {negocio}! Eres un cliente increíble 💚`,

  screenshot_retry: `¡Hola, {nombre}! 😊 Hemos recibido tu foto, pero no hemos podido ver claramente las estrellas.

¿Podrías enviarnos una captura un poco más nítida donde se vea la reseña completa? En cuanto lo confirmemos, te enviamos tu regalo 🎁`,

  conversation_closing: `¡Muchas gracias por tu tiempo, {nombre}! 😊 Ha sido un placer hablar contigo. Si necesitas algo más, no dudes en contactar directamente con {negocio}. ¡Hasta pronto! 💚`,
};

// ---------------------------------------------------------------------------
// Plantillas: Usted (trato formal)
// ---------------------------------------------------------------------------

const USTED: ToneTemplates = {
  positive: `¡Qué alegría saber eso, {nombre}! 🙌 Nos encanta que haya tenido una buena experiencia en {negocio}.

¿Se animaría a dejarnos una reseña en {plataforma}? Con solo un minuto de su tiempo ayudaría a más personas a encontrarnos:

👉 {url}

¡Muchas gracias de corazón! 💚`,

  negative: `Gracias por su honestidad, {nombre}. Lamentamos que su experiencia no haya sido la que esperaba 😔

En {negocio} tomamos muy en serio cada opinión. Si quiere contarnos qué ocurrió para poder mejorar, no dude en responder a este mensaje.

Su opinión es muy valiosa para nosotros. ¡Esperamos poder atenderle pronto y darle la experiencia que merece! 🙏`,

  neutral: `Gracias por su respuesta, {nombre} 😊 Nos alegra que haya pasado por {negocio}.

Si quiere compartir su experiencia en {plataforma}, nos ayudaría mucho:

👉 {url}

¡Hasta pronto! 💚`,

  fallback: `¡Gracias por su respuesta, {nombre}! 😊 Su opinión es muy importante para {negocio}.`,

  positive_incentive: `¡Qué alegría saber eso, {nombre}! 🙌 Nos encanta que haya tenido una gran experiencia en {negocio}.

¿Se animaría a dejarnos una reseña en {plataforma}? Es muy sencillo:

👉 {url}

Y como agradecimiento por su tiempo, su regalo: *{incentivo}* 🎁

Cuando publique su reseña, envíenos una captura de pantalla y se lo hacemos llegar enseguida. ¡Muchas gracias! 💚`,

  screenshot_verified: `¡Muchísimas gracias, {nombre}! 🎉 Hemos comprobado su reseña en {plataforma}.

Como prometimos, aquí tiene su regalo: *{incentivo}* 🎁

¡Gracias por confiar en {negocio}! Es usted un cliente increíble 💚`,

  screenshot_retry: `¡Hola, {nombre}! 😊 Hemos recibido su foto, pero no hemos podido ver claramente las estrellas.

¿Podría enviarnos una captura un poco más nítida donde se vea la reseña completa? En cuanto lo confirmemos, le enviamos su regalo 🎁`,

  conversation_closing: `¡Muchas gracias por su tiempo, {nombre}! 😊 Ha sido un placer hablar con usted. Si necesita algo más, no dude en contactar directamente con {negocio}. ¡Hasta pronto! 💚`,
};

// ---------------------------------------------------------------------------
// Plantillas: Juvenil (muy informal, desenfadado)
// ---------------------------------------------------------------------------

const JUVENIL: ToneTemplates = {
  positive: `¡Genial, {nombre}! 🔥 ¡Nos alegra un montón que te haya ido bien en {negocio}!

¿Nos echas una mano dejando una reseña en {plataforma}? ¡Nos ayuda muchísimo! 🙏

👉 {url}

¡Eres lo más! 💚✨`,

  negative: `Vaya, {nombre}, nos sabe muy mal que no haya ido bien 😕

En {negocio} queremos mejorar y tu opinión nos ayuda un montón. ¿Nos cuentas qué pasó? 💬

¡Ojalá podamos verte pronto y darte una experiencia mucho mejor! 🙌`,

  neutral: `¡Gracias por responder, {nombre}! 😊 ¡Mola que hayas pasado por {negocio}!

Si te apetece, puedes dejarnos tu opinión en {plataforma}, ¡nos ayuda un montón!

👉 {url}

¡Nos vemos pronto! 🙌`,

  fallback: `¡Gracias por responder, {nombre}! 😊 ¡Tu opinión nos ayuda un montón en {negocio}!`,

  positive_incentive: `¡Genial, {nombre}! 🔥 ¡Nos alegra mogollón que te haya ido tan bien en {negocio}!

¿Nos haces el mega favor de dejarnos una reseña en {plataforma}? ¡Tardas solo un minuto!

👉 {url}

Y de parte nuestra, tu regalo: *{incentivo}* 🎁🙌

Cuando pongas la reseña, mándanos una captura y te lo mandamos al momento. ¡Eres lo mejor! 💚`,

  screenshot_verified: `¡MUCHAS GRACIAS, {nombre}! 🎉🔥 ¡Hemos visto tu reseña en {plataforma} y estamos súper contentos!

Como te dijimos, aquí va tu regalo: *{incentivo}* 🎁

¡Eres increíble! Gracias por apoyar a {negocio} 💚✨`,

  screenshot_retry: `¡Ey, {nombre}! 😊 Hemos visto tu foto pero no se ven del todo bien las estrellitas.

¿Puedes mandarnos otra captura más clarita con la reseña? En cuanto lo veamos te enviamos tu regalo 🎁`,

  conversation_closing: `¡Muchas gracias por el ratillo, {nombre}! 😊 Ha sido genial hablar contigo. Si necesitas algo, no te olvides de contactar con {negocio}. ¡Cuídate! 💚`,
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
  "¡Hola {nombre}! Soy el equipo de {negocio}. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊 (Responde STOP si no deseas recibir más mensajes)";
