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

import type { BusinessTone, WhatsAppLanguage } from "@/types";

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
// ESPAÑOL (es)
// ---------------------------------------------------------------------------

const TUTEO_ES: ToneTemplates = {
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

const USTED_ES: ToneTemplates = {
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

const JUVENIL_ES: ToneTemplates = {
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
// ENGLISH (en)
// ---------------------------------------------------------------------------

const TUTEO_EN: ToneTemplates = {
  positive: `Great to hear that, {nombre}! 🙌 We're so glad you had a good experience at {negocio}.

Would you mind leaving us a review on {plataforma}? It only takes a minute and helps others find us:

👉 {url}

Thank you so much! 💚`,

  negative: `Thanks for your honesty, {nombre}. We're sorry to hear your experience didn't meet your expectations 😔

At {negocio} we take every piece of feedback seriously. Feel free to reply to this message and tell us what happened so we can improve.

Your opinion means a lot to us. We hope to see you again soon! 🙏`,

  neutral: `Thanks for your reply, {nombre} 😊 Glad you stopped by {negocio}.

If you'd like to share your experience on {plataforma}, it would mean a lot to us:

👉 {url}

See you soon! 💚`,

  fallback: `Thanks for your reply, {nombre}! 😊 Your feedback is really important to {negocio}.`,

  positive_incentive: `Great to hear that, {nombre}! 🙌 We're so glad you had a great experience at {negocio}.

Would you mind leaving us a review on {plataforma}? It's really simple:

👉 {url}

As a thank-you for your time, here's your gift: *{incentivo}* 🎁

Once you post your review, send us a screenshot and we'll send it right over. Thank you! 💚`,

  screenshot_verified: `Thank you so much, {nombre}! 🎉 We've verified your review on {plataforma}.

As promised, here's your gift: *{incentivo}* 🎁

Thank you for trusting {negocio}! You're an amazing customer 💚`,

  screenshot_retry: `Hi {nombre}! 😊 We received your photo, but we couldn't clearly see the stars.

Could you send us a slightly clearer screenshot showing the full review? Once we confirm it, we'll send you your gift 🎁`,

  conversation_closing: `Thank you so much for your time, {nombre}! 😊 It's been a pleasure talking with you. If you need anything else, don't hesitate to contact {negocio} directly. See you soon! 💚`,
};

const USTED_EN: ToneTemplates = {
  positive: `Great to hear that, {nombre}! 🙌 We're so glad you had a good experience at {negocio}.

Would you be willing to leave us a review on {plataforma}? With just a minute of your time you'd help more people find us:

👉 {url}

Thank you sincerely! 💚`,

  negative: `Thank you for your honesty, {nombre}. We are sorry that your experience did not meet your expectations 😔

At {negocio} we take every opinion very seriously. If you would like to tell us what happened so we can improve, please do not hesitate to reply to this message.

Your opinion is very valuable to us. We hope to welcome you again soon! 🙏`,

  neutral: `Thank you for your reply, {nombre} 😊 We are glad you visited {negocio}.

If you would like to share your experience on {plataforma}, it would help us greatly:

👉 {url}

Until next time! 💚`,

  fallback: `Thank you for your reply, {nombre}! 😊 Your feedback is very important to {negocio}.`,

  positive_incentive: `Great to hear that, {nombre}! 🙌 We are delighted that you had such a great experience at {negocio}.

Would you be willing to leave us a review on {plataforma}? It is very straightforward:

👉 {url}

As a token of appreciation, here is your gift: *{incentivo}* 🎁

Once you publish your review, please send us a screenshot and we will send it to you straight away. Thank you! 💚`,

  screenshot_verified: `Thank you very much, {nombre}! 🎉 We have verified your review on {plataforma}.

As promised, here is your gift: *{incentivo}* 🎁

Thank you for trusting {negocio}! You are a wonderful customer 💚`,

  screenshot_retry: `Hello {nombre}! 😊 We received your photo, but we were unable to see the stars clearly.

Could you send us a slightly clearer screenshot showing the full review? Once we have confirmed it, we will send your gift 🎁`,

  conversation_closing: `Thank you very much for your time, {nombre}! 😊 It has been a pleasure speaking with you. Should you need anything further, please do not hesitate to contact {negocio} directly. Until next time! 💚`,
};

const JUVENIL_EN: ToneTemplates = {
  positive: `Amazing, {nombre}! 🔥 So stoked you had a great time at {negocio}!

Could you drop us a review on {plataforma}? It helps us loads! 🙏

👉 {url}

You're the best! 💚✨`,

  negative: `Aw, {nombre}, that really sucks to hear 😕

At {negocio} we want to get better and your feedback helps tons. Wanna tell us what went wrong? 💬

Hoping to see you again soon for a way better experience! 🙌`,

  neutral: `Thanks for hitting back, {nombre}! 😊 Awesome that you came by {negocio}!

Feel like leaving a quick review on {plataforma}? It really helps!

👉 {url}

Catch you later! 🙌`,

  fallback: `Thanks for replying, {nombre}! 😊 Your opinion is super helpful for {negocio}!`,

  positive_incentive: `Amazing, {nombre}! 🔥 So stoked you had such a great time at {negocio}!

Could you do us a solid and drop a review on {plataforma}? Takes like a minute!

👉 {url}

And as a little thank-you, here's your gift: *{incentivo}* 🎁🙌

Once you post the review, send us a screenshot and we'll hook you up right away. You're the best! 💚`,

  screenshot_verified: `THANK YOU SO MUCH, {nombre}! 🎉🔥 We saw your review on {plataforma} and we're absolutely stoked!

As we said, here's your gift: *{incentivo}* 🎁

You're incredible! Thanks for supporting {negocio} 💚✨`,

  screenshot_retry: `Hey {nombre}! 😊 Got your pic but the stars aren't super clear.

Could you send a slightly clearer screenshot with the review? Once we see it we'll send your gift 🎁`,

  conversation_closing: `Thanks so much for chatting, {nombre}! 😊 It's been awesome talking to you. If you need anything, hit up {negocio} directly. Take care! 💚`,
};

// ---------------------------------------------------------------------------
// FRENCH (fr)
// ---------------------------------------------------------------------------

const TUTEO_FR: ToneTemplates = {
  positive: `Super nouvelle, {nombre} ! 🙌 On est ravis que tu aies passé un bon moment chez {negocio}.

Tu pourrais nous laisser un avis sur {plataforma} ? Une minute suffit et ça aide d'autres personnes à nous trouver :

👉 {url}

Merci du fond du cœur ! 💚`,

  negative: `Merci pour ton honnêteté, {nombre}. Nous sommes désolés que ton expérience n'ait pas été à la hauteur de tes attentes 😔

Chez {negocio}, chaque avis compte. Si tu veux nous dire ce qui s'est passé pour nous aider à nous améliorer, n'hésite pas à répondre à ce message.

Ton opinion nous est très précieuse. On espère te revoir bientôt ! 🙏`,

  neutral: `Merci pour ta réponse, {nombre} 😊 On est contents que tu sois passé chez {negocio}.

Si tu veux partager ton expérience sur {plataforma}, ça nous aiderait beaucoup :

👉 {url}

À bientôt ! 💚`,

  fallback: `Merci pour ta réponse, {nombre} ! 😊 Ton avis est très important pour {negocio}.`,

  positive_incentive: `Super nouvelle, {nombre} ! 🙌 On est ravis que tu aies passé un super moment chez {negocio}.

Tu pourrais nous laisser un avis sur {plataforma} ? C'est très simple :

👉 {url}

Et pour te remercier de ton temps, voici ton cadeau : *{incentivo}* 🎁

Quand tu publies ton avis, envoie-nous une capture d'écran et on te l'envoie aussitôt. Merci ! 💚`,

  screenshot_verified: `Merci infiniment, {nombre} ! 🎉 Nous avons vérifié ton avis sur {plataforma}.

Comme promis, voici ton cadeau : *{incentivo}* 🎁

Merci de faire confiance à {negocio} ! Tu es un client formidable 💚`,

  screenshot_retry: `Bonjour {nombre} ! 😊 Nous avons reçu ta photo, mais on n'a pas pu voir les étoiles clairement.

Pourrais-tu nous envoyer une capture un peu plus nette avec l'avis complet ? Dès qu'on le confirme, on t'envoie ton cadeau 🎁`,

  conversation_closing: `Merci beaucoup pour ton temps, {nombre} ! 😊 C'était un plaisir d'échanger avec toi. Si tu as besoin de quoi que ce soit, n'hésite pas à contacter {negocio} directement. À bientôt ! 💚`,
};

const USTED_FR: ToneTemplates = {
  positive: `Quelle bonne nouvelle, {nombre} ! 🙌 Nous sommes ravis que vous ayez eu une bonne expérience chez {negocio}.

Accepteriez-vous de nous laisser un avis sur {plataforma} ? Une minute suffit et cela aide d'autres personnes à nous trouver :

👉 {url}

Merci du fond du cœur ! 💚`,

  negative: `Merci pour votre honnêteté, {nombre}. Nous sommes désolés que votre expérience n'ait pas été à la hauteur de vos attentes 😔

Chez {negocio}, chaque avis compte. Si vous souhaitez nous dire ce qui s'est passé, n'hésitez pas à répondre à ce message.

Votre opinion nous est très précieuse. Nous espérons vous revoir bientôt ! 🙏`,

  neutral: `Merci pour votre réponse, {nombre} 😊 Nous sommes ravis que vous soyez passé chez {negocio}.

Si vous souhaitez partager votre expérience sur {plataforma}, cela nous aiderait beaucoup :

👉 {url}

À bientôt ! 💚`,

  fallback: `Merci pour votre réponse, {nombre} ! 😊 Votre avis est très important pour {negocio}.`,

  positive_incentive: `Quelle bonne nouvelle, {nombre} ! 🙌 Nous sommes ravis que vous ayez eu une excellente expérience chez {negocio}.

Accepteriez-vous de nous laisser un avis sur {plataforma} ? C'est très simple :

👉 {url}

En remerciement de votre temps, voici votre cadeau : *{incentivo}* 🎁

Lorsque vous publiez votre avis, envoyez-nous une capture d'écran et nous vous le ferons parvenir aussitôt. Merci ! 💚`,

  screenshot_verified: `Merci infiniment, {nombre} ! 🎉 Nous avons vérifié votre avis sur {plataforma}.

Comme promis, voici votre cadeau : *{incentivo}* 🎁

Merci de faire confiance à {negocio} ! Vous êtes un client formidable 💚`,

  screenshot_retry: `Bonjour {nombre} ! 😊 Nous avons reçu votre photo, mais nous n'avons pas pu voir clairement les étoiles.

Pourriez-vous nous envoyer une capture un peu plus nette avec l'avis complet ? Dès confirmation, nous vous enverrons votre cadeau 🎁`,

  conversation_closing: `Merci beaucoup pour votre temps, {nombre} ! 😊 Ce fut un plaisir d'échanger avec vous. Si vous avez besoin de quoi que ce soit, n'hésitez pas à contacter {negocio} directement. À bientôt ! 💚`,
};

const JUVENIL_FR: ToneTemplates = {
  positive: `Trop bien, {nombre} ! 🔥 On est grave contents que ça se soit bien passé chez {negocio} !

Tu nous laisses un avis sur {plataforma} ? Ça nous aide vachement ! 🙏

👉 {url}

T'es le/la meilleur(e) ! 💚✨`,

  negative: `Aïe, {nombre}, désolés que ça n'ait pas été terrible 😕

Chez {negocio} on veut vraiment progresser et ton avis nous aide super. Tu nous dis ce qui s'est passé ? 💬

On espère te revoir vite pour te donner une bien meilleure expérience ! 🙌`,

  neutral: `Merci d'avoir répondu, {nombre} ! 😊 Cool que t'aies passé chez {negocio} !

Si t'as envie, tu peux laisser un petit avis sur {plataforma}, ça aide beaucoup !

👉 {url}

À plus ! 🙌`,

  fallback: `Merci d'avoir répondu, {nombre} ! 😊 Ton avis aide vraiment {negocio} !`,

  positive_incentive: `Trop bien, {nombre} ! 🔥 On est grave contents que t'aies autant kiffé {negocio} !

Tu nous fais le kiff de laisser un avis sur {plataforma} ? Ça prend juste une minute !

👉 {url}

Et de notre part, ton cadeau : *{incentivo}* 🎁🙌

Quand tu postes l'avis, envoie-nous un screenshot et on t'envoie ça illico. T'es vraiment au top ! 💚`,

  screenshot_verified: `MERCI TROP, {nombre} ! 🎉🔥 On a vu ton avis sur {plataforma} et on est super contents !

Comme on t'a dit, voilà ton cadeau : *{incentivo}* 🎁

T'es incroyable ! Merci de soutenir {negocio} 💚✨`,

  screenshot_retry: `Eh {nombre} ! 😊 On a reçu ta photo mais les étoiles sont pas super nettes.

Tu peux nous envoyer un screenshot un peu plus clair avec l'avis ? Dès qu'on voit ça on t'envoie ton cadeau 🎁`,

  conversation_closing: `Merci beaucoup pour ce moment, {nombre} ! 😊 C'était trop sympa de discuter avec toi. Si t'as besoin de quoi, contacte {negocio} directement. Prends soin de toi ! 💚`,
};

// ---------------------------------------------------------------------------
// GERMAN (de)
// ---------------------------------------------------------------------------

const TUTEO_DE: ToneTemplates = {
  positive: `Das freut uns sehr, {nombre}! 🙌 Schön, dass du bei {negocio} eine gute Erfahrung gemacht hast.

Würdest du uns eine Bewertung auf {plataforma} hinterlassen? Eine Minute reicht und hilft anderen, uns zu finden:

👉 {url}

Vielen herzlichen Dank! 💚`,

  negative: `Danke für deine Ehrlichkeit, {nombre}. Es tut uns leid, dass dein Besuch nicht deinen Erwartungen entsprach 😔

Bei {negocio} nehmen wir jedes Feedback ernst. Wenn du uns erzählen möchtest, was passiert ist, damit wir uns verbessern können, antworte einfach auf diese Nachricht.

Deine Meinung ist uns sehr wichtig. Wir hoffen, dich bald wiederzusehen! 🙏`,

  neutral: `Danke für deine Antwort, {nombre} 😊 Schön, dass du bei {negocio} warst.

Wenn du deine Erfahrung auf {plataforma} teilen möchtest, wäre uns das eine große Hilfe:

👉 {url}

Bis bald! 💚`,

  fallback: `Danke für deine Antwort, {nombre}! 😊 Deine Meinung ist sehr wichtig für {negocio}.`,

  positive_incentive: `Das freut uns sehr, {nombre}! 🙌 Schön, dass du bei {negocio} eine tolle Erfahrung gemacht hast.

Würdest du uns eine Bewertung auf {plataforma} hinterlassen? Es ist ganz einfach:

👉 {url}

Als Dankeschön für deine Zeit ist hier dein Geschenk: *{incentivo}* 🎁

Wenn du deine Bewertung veröffentlichst, schick uns einen Screenshot und wir schicken es dir sofort. Vielen Dank! 💚`,

  screenshot_verified: `Herzlichen Dank, {nombre}! 🎉 Wir haben deine Bewertung auf {plataforma} überprüft.

Wie versprochen, hier ist dein Geschenk: *{incentivo}* 🎁

Danke, dass du {negocio} vertraust! Du bist ein toller Kunde 💚`,

  screenshot_retry: `Hallo {nombre}! 😊 Wir haben dein Foto erhalten, konnten die Sterne aber nicht deutlich erkennen.

Könntest du uns einen etwas klareren Screenshot schicken, auf dem die vollständige Bewertung zu sehen ist? Sobald wir es bestätigen, schicken wir dir dein Geschenk 🎁`,

  conversation_closing: `Vielen Dank für deine Zeit, {nombre}! 😊 Es war schön, mit dir zu plaudern. Wenn du noch etwas brauchst, wende dich direkt an {negocio}. Bis bald! 💚`,
};

const USTED_DE: ToneTemplates = {
  positive: `Das freut uns sehr, {nombre}! 🙌 Es ist schön zu wissen, dass Sie bei {negocio} eine gute Erfahrung gemacht haben.

Würden Sie uns eine Bewertung auf {plataforma} hinterlassen? Eine Minute reicht und hilft anderen, uns zu finden:

👉 {url}

Vielen herzlichen Dank! 💚`,

  negative: `Danke für Ihre Ehrlichkeit, {nombre}. Es tut uns leid, dass Ihr Besuch nicht Ihren Erwartungen entsprach 😔

Bei {negocio} nehmen wir jedes Feedback ernst. Wenn Sie uns erzählen möchten, was passiert ist, damit wir uns verbessern können, antworten Sie bitte auf diese Nachricht.

Ihre Meinung ist uns sehr wichtig. Wir hoffen, Sie bald wiederzusehen! 🙏`,

  neutral: `Danke für Ihre Antwort, {nombre} 😊 Es freut uns, dass Sie bei {negocio} waren.

Wenn Sie Ihre Erfahrung auf {plataforma} teilen möchten, wäre uns das eine große Hilfe:

👉 {url}

Bis bald! 💚`,

  fallback: `Danke für Ihre Antwort, {nombre}! 😊 Ihre Meinung ist sehr wichtig für {negocio}.`,

  positive_incentive: `Das freut uns sehr, {nombre}! 🙌 Es ist wunderbar zu wissen, dass Sie bei {negocio} eine großartige Erfahrung gemacht haben.

Würden Sie uns eine Bewertung auf {plataforma} hinterlassen? Es ist ganz einfach:

👉 {url}

Als Dankeschön für Ihre Zeit ist hier Ihr Geschenk: *{incentivo}* 🎁

Wenn Sie Ihre Bewertung veröffentlichen, senden Sie uns bitte einen Screenshot und wir senden es Ihnen sofort zu. Vielen Dank! 💚`,

  screenshot_verified: `Herzlichen Dank, {nombre}! 🎉 Wir haben Ihre Bewertung auf {plataforma} überprüft.

Wie versprochen, hier ist Ihr Geschenk: *{incentivo}* 🎁

Danke, dass Sie {negocio} vertrauen! Sie sind ein wundervoller Kunde 💚`,

  screenshot_retry: `Guten Tag {nombre}! 😊 Wir haben Ihr Foto erhalten, konnten die Sterne jedoch nicht deutlich erkennen.

Könnten Sie uns einen etwas klareren Screenshot schicken, auf dem die vollständige Bewertung zu sehen ist? Sobald wir es bestätigen, senden wir Ihnen Ihr Geschenk 🎁`,

  conversation_closing: `Vielen Dank für Ihre Zeit, {nombre}! 😊 Es war uns ein Vergnügen, mit Ihnen zu sprechen. Sollten Sie etwas benötigen, wenden Sie sich bitte direkt an {negocio}. Auf Wiedersehen! 💚`,
};

const JUVENIL_DE: ToneTemplates = {
  positive: `Krass cool, {nombre}! 🔥 Mega, dass es dir bei {negocio} so gut gefallen hat!

Kannst du uns kurz eine Bewertung auf {plataforma} dalassen? Hilft uns mega! 🙏

👉 {url}

Du bist der/die Beste! 💚✨`,

  negative: `Oh nein, {nombre}, das tut uns echt leid 😕

Bei {negocio} wollen wir immer besser werden und dein Feedback hilft uns dabei. Erzähl uns, was schief gelaufen ist? 💬

Wir hoffen, dich bald wiederzusehen und dir eine viel bessere Erfahrung zu geben! 🙌`,

  neutral: `Danke für deine Antwort, {nombre}! 😊 Fett, dass du bei {negocio} warst!

Wenn du Lust hast, lass uns doch eine kurze Bewertung auf {plataforma} da — hilft echt viel!

👉 {url}

Bis bald! 🙌`,

  fallback: `Danke für deine Antwort, {nombre}! 😊 Deine Meinung hilft {negocio} richtig weiter!`,

  positive_incentive: `Mega cool, {nombre}! 🔥 Krass, dass es dir bei {negocio} so gut gegangen ist!

Kannst du uns den Riesen-Gefallen tun und eine Bewertung auf {plataforma} dalassen? Dauert echt nur ne Minute!

👉 {url}

Und als kleines Danke, dein Geschenk: *{incentivo}* 🎁🙌

Wenn du die Bewertung postest, schick uns einen Screenshot und wir schicken es dir sofort. Du bist der/die Beste! 💚`,

  screenshot_verified: `MEGA DANKE, {nombre}! 🎉🔥 Wir haben deine Bewertung auf {plataforma} gesehen und sind mega happy!

Wie gesagt, hier ist dein Geschenk: *{incentivo}* 🎁

Du bist der Wahnsinn! Danke, dass du {negocio} unterstützt 💚✨`,

  screenshot_retry: `Hey {nombre}! 😊 Wir haben dein Foto, aber die Sternchen sind nicht so gut zu sehen.

Kannst du uns einen klareren Screenshot mit der Bewertung schicken? Sobald wir's sehen, schicken wir dir dein Geschenk 🎁`,

  conversation_closing: `Mega danke für die Zeit, {nombre}! 😊 War echt cool, mit dir zu quatschen. Wenn du was brauchst, meld dich direkt bei {negocio}. Pass auf dich auf! 💚`,
};

// ---------------------------------------------------------------------------
// ITALIAN (it)
// ---------------------------------------------------------------------------

const TUTEO_IT: ToneTemplates = {
  positive: `Che bello sentirselo dire, {nombre}! 🙌 Siamo contenti che tu abbia avuto una buona esperienza da {negocio}.

Ti andrebbe di lasciarci una recensione su {plataforma}? Bastano un paio di minuti e aiuteresti altre persone a trovarci:

👉 {url}

Grazie di cuore! 💚`,

  negative: `Grazie per la tua onestà, {nombre}. Ci dispiace che la tua esperienza non sia stata all'altezza delle aspettative 😔

Da {negocio} prendiamo sul serio ogni opinione. Se vuoi raccontarci cosa è successo per aiutarci a migliorare, rispondi pure a questo messaggio.

La tua opinione è preziosa. Speriamo di rivederti presto! 🙏`,

  neutral: `Grazie per la risposta, {nombre} 😊 Siamo contenti che tu sia passato da {negocio}.

Se vuoi condividere la tua esperienza su {plataforma}, ci aiuterebbe molto:

👉 {url}

A presto! 💚`,

  fallback: `Grazie per la risposta, {nombre}! 😊 La tua opinione è molto importante per {negocio}.`,

  positive_incentive: `Che bello sentirselo dire, {nombre}! 🙌 Siamo contenti che tu abbia avuto una grande esperienza da {negocio}.

Ti andrebbe di lasciarci una recensione su {plataforma}? È semplicissimo:

👉 {url}

Come ringraziamento per il tuo tempo, ecco il tuo regalo: *{incentivo}* 🎁

Quando pubblichi la recensione, mandaci uno screenshot e te lo inviamo subito. Grazie! 💚`,

  screenshot_verified: `Grazie mille, {nombre}! 🎉 Abbiamo verificato la tua recensione su {plataforma}.

Come promesso, ecco il tuo regalo: *{incentivo}* 🎁

Grazie per aver scelto {negocio}! Sei un cliente straordinario 💚`,

  screenshot_retry: `Ciao {nombre}! 😊 Abbiamo ricevuto la tua foto, ma non riusciamo a vedere chiaramente le stelle.

Potresti mandarci uno screenshot un po' più nitido con la recensione completa? Appena lo confermiamo, ti mandiamo il regalo 🎁`,

  conversation_closing: `Grazie mille per il tuo tempo, {nombre}! 😊 È stato un piacere parlare con te. Se hai bisogno di qualcosa, contatta direttamente {negocio}. A presto! 💚`,
};

const USTED_IT: ToneTemplates = {
  positive: `Che bello sentirselo dire, {nombre}! 🙌 Siamo lieti che Lei abbia avuto una buona esperienza da {negocio}.

Sarebbe disposto a lasciarci una recensione su {plataforma}? Bastano un paio di minuti e aiuterebbe altre persone a trovarci:

👉 {url}

Grazie di cuore! 💚`,

  negative: `Grazie per la Sua onestà, {nombre}. Ci dispiace che la Sua esperienza non sia stata all'altezza delle aspettative 😔

Da {negocio} prendiamo sul serio ogni opinione. Se desidera raccontarci cosa è successo, risponda pure a questo messaggio.

La Sua opinione è preziosa. Speriamo di rivederLa presto! 🙏`,

  neutral: `Grazie per la risposta, {nombre} 😊 Siamo lieti che Lei abbia visitato {negocio}.

Se desidera condividere la Sua esperienza su {plataforma}, ci sarebbe di grande aiuto:

👉 {url}

A presto! 💚`,

  fallback: `Grazie per la risposta, {nombre}! 😊 La Sua opinione è molto importante per {negocio}.`,

  positive_incentive: `Che bello sentirselo dire, {nombre}! 🙌 Siamo lieti che Lei abbia avuto un'ottima esperienza da {negocio}.

Sarebbe disposto a lasciarci una recensione su {plataforma}? È molto semplice:

👉 {url}

In segno di ringraziamento per il Suo tempo, ecco il Suo regalo: *{incentivo}* 🎁

Quando pubblica la recensione, ci invii uno screenshot e glielo faremo avere subito. Grazie! 💚`,

  screenshot_verified: `Grazie mille, {nombre}! 🎉 Abbiamo verificato la Sua recensione su {plataforma}.

Come promesso, ecco il Suo regalo: *{incentivo}* 🎁

Grazie per aver scelto {negocio}! È un cliente straordinario 💚`,

  screenshot_retry: `Buongiorno {nombre}! 😊 Abbiamo ricevuto la Sua foto, ma non riusciamo a vedere chiaramente le stelle.

Potrebbe mandarci uno screenshot un po' più nitido con la recensione completa? Appena lo confermiamo, Le invieremo il regalo 🎁`,

  conversation_closing: `Grazie mille per il Suo tempo, {nombre}! 😊 È stato un piacere parlare con Lei. Se ha bisogno di qualcosa, non esiti a contattare {negocio} direttamente. A presto! 💚`,
};

const JUVENIL_IT: ToneTemplates = {
  positive: `Fantastico, {nombre}! 🔥 Mega contenti che ti sia trovato bene da {negocio}!

Ci dai una mano lasciandoci una recensione su {plataforma}? Ci aiuta un sacco! 🙏

👉 {url}

Sei il/la migliore! 💚✨`,

  negative: `Dai {nombre}, ci dispiace tanto che non sia andata bene 😕

Da {negocio} vogliamo sempre migliorare e la tua opinione ci aiuta tantissimo. Ci racconti com'è andata? 💬

Speriamo di rivederti presto per darti un'esperienza molto migliore! 🙌`,

  neutral: `Grazie per la risposta, {nombre}! 😊 Figata che tu sia passato da {negocio}!

Se ti va, lasciaci una recensione su {plataforma}, ci aiuta un sacco!

👉 {url}

A presto! 🙌`,

  fallback: `Grazie per la risposta, {nombre}! 😊 La tua opinione aiuta tantissimo {negocio}!`,

  positive_incentive: `Che figata, {nombre}! 🔥 Siamo contentissimi che tu ti sia trovato così bene da {negocio}!

Ci fai il mega favore di lasciarci una recensione su {plataforma}? Ci vuole un minuto!

👉 {url}

E da parte nostra, il tuo regalo: *{incentivo}* 🎁🙌

Quando metti la recensione, mandaci uno screenshot e te lo mandiamo subito. Sei troppo forte! 💚`,

  screenshot_verified: `GRAZIE MILLE, {nombre}! 🎉🔥 Abbiamo visto la tua recensione su {plataforma} e siamo super felici!

Come ti avevamo detto, ecco il tuo regalo: *{incentivo}* 🎁

Sei incredibile! Grazie per supportare {negocio} 💚✨`,

  screenshot_retry: `Ehi {nombre}! 😊 Abbiamo visto la tua foto ma le stelline non si vedono benissimo.

Puoi mandarci uno screenshot un po' più chiaro con la recensione? Appena lo vediamo ti mandiamo il regalo 🎁`,

  conversation_closing: `Grazie mille per il tempo, {nombre}! 😊 È stato bellissimo parlare con te. Se hai bisogno di qualcosa, contatta {negocio} direttamente. Prenditi cura! 💚`,
};

// ---------------------------------------------------------------------------
// PORTUGUESE (pt)
// ---------------------------------------------------------------------------

const TUTEO_PT: ToneTemplates = {
  positive: `Que bom ouvir isso, {nombre}! 🙌 Ficamos felizes que tenhas tido uma boa experiência em {negocio}.

Aceitas deixar-nos uma avaliação no {plataforma}? Só demora um minuto e ajuda outras pessoas a encontrar-nos:

👉 {url}

Muito obrigado do fundo do coração! 💚`,

  negative: `Obrigado pela tua honestidade, {nombre}. Lamentamos que a tua experiência não tenha correspondido às tuas expectativas 😔

Em {negocio} levamos cada opinião muito a sério. Se quiseres contar-nos o que aconteceu para podermos melhorar, não hesites em responder a esta mensagem.

A tua opinião é muito valiosa. Esperamos ver-te novamente em breve! 🙏`,

  neutral: `Obrigado pela resposta, {nombre} 😊 Fico contente que tenhas passado por {negocio}.

Se quiseres partilhar a tua experiência no {plataforma}, seria uma grande ajuda:

👉 {url}

Até breve! 💚`,

  fallback: `Obrigado pela resposta, {nombre}! 😊 A tua opinião é muito importante para {negocio}.`,

  positive_incentive: `Que bom ouvir isso, {nombre}! 🙌 Ficamos felizes que tenhas tido uma ótima experiência em {negocio}.

Aceitas deixar-nos uma avaliação no {plataforma}? É muito simples:

👉 {url}

Como agradecimento pelo teu tempo, aqui está o teu presente: *{incentivo}* 🎁

Quando publicares a tua avaliação, envia-nos um screenshot e nós enviamos imediatamente. Obrigado! 💚`,

  screenshot_verified: `Muito obrigado, {nombre}! 🎉 Verificámos a tua avaliação no {plataforma}.

Como prometido, aqui está o teu presente: *{incentivo}* 🎁

Obrigado por confiares em {negocio}! És um cliente incrível 💚`,

  screenshot_retry: `Olá {nombre}! 😊 Recebemos a tua foto, mas não conseguimos ver claramente as estrelas.

Podes enviar-nos um screenshot um pouco mais nítido com a avaliação completa? Assim que confirmarmos, enviamos o teu presente 🎁`,

  conversation_closing: `Muito obrigado pelo teu tempo, {nombre}! 😊 Foi um prazer falar contigo. Se precisares de mais alguma coisa, não hesites em contactar {negocio} diretamente. Até breve! 💚`,
};

const USTED_PT: ToneTemplates = {
  positive: `Que bom ouvir isso, {nombre}! 🙌 Ficamos muito contentes que tenha tido uma boa experiência em {negocio}.

Aceitaria deixar-nos uma avaliação no {plataforma}? Só demora um minuto e ajuda outras pessoas a encontrar-nos:

👉 {url}

Muito obrigado do fundo do coração! 💚`,

  negative: `Obrigado pela sua honestidade, {nombre}. Lamentamos que a sua experiência não tenha correspondido às suas expectativas 😔

Em {negocio} levamos cada opinião muito a sério. Se desejar contar-nos o que aconteceu, não hesite em responder a esta mensagem.

A sua opinião é muito valiosa. Esperamos vê-lo(a) novamente em breve! 🙏`,

  neutral: `Obrigado pela resposta, {nombre} 😊 Ficamos contentes que tenha visitado {negocio}.

Se desejar partilhar a sua experiência no {plataforma}, seria uma grande ajuda:

👉 {url}

Até breve! 💚`,

  fallback: `Obrigado pela resposta, {nombre}! 😊 A sua opinião é muito importante para {negocio}.`,

  positive_incentive: `Que bom ouvir isso, {nombre}! 🙌 Ficamos muito contentes que tenha tido uma excelente experiência em {negocio}.

Aceitaria deixar-nos uma avaliação no {plataforma}? É muito simples:

👉 {url}

Como agradecimento pelo seu tempo, aqui está o seu presente: *{incentivo}* 🎁

Quando publicar a sua avaliação, envie-nos um screenshot e nós enviamos imediatamente. Obrigado! 💚`,

  screenshot_verified: `Muito obrigado, {nombre}! 🎉 Verificámos a sua avaliação no {plataforma}.

Como prometido, aqui está o seu presente: *{incentivo}* 🎁

Obrigado por confiar em {negocio}! É um cliente maravilhoso 💚`,

  screenshot_retry: `Bom dia {nombre}! 😊 Recebemos a sua foto, mas não conseguimos ver claramente as estrelas.

Poderia enviar-nos um screenshot um pouco mais nítido com a avaliação completa? Assim que confirmarmos, enviaremos o seu presente 🎁`,

  conversation_closing: `Muito obrigado pelo seu tempo, {nombre}! 😊 Foi um prazer falar consigo. Se precisar de mais alguma coisa, não hesite em contactar {negocio} diretamente. Até breve! 💚`,
};

const JUVENIL_PT: ToneTemplates = {
  positive: `Que fixe, {nombre}! 🔥 Estamos mesmo contentes que tenhas curtido a tua ida a {negocio}!

Dás-nos uma ajuda deixando uma avaliação no {plataforma}? Ajuda-nos imenso! 🙏

👉 {url}

És o/a melhor! 💚✨`,

  negative: `Ei {nombre}, lamentamos mesmo que não tenha corrido bem 😕

Em {negocio} queremos sempre melhorar e a tua opinião ajuda-nos muito. Contas-nos o que se passou? 💬

Esperamos ver-te em breve para te dar uma experiência muito melhor! 🙌`,

  neutral: `Obrigado por responder, {nombre}! 😊 Fixe que tenhas passado por {negocio}!

Se quiseres, podes deixar uma avaliação no {plataforma}, ajuda mesmo muito!

👉 {url}

Até já! 🙌`,

  fallback: `Obrigado por responder, {nombre}! 😊 A tua opinião ajuda mesmo muito {negocio}!`,

  positive_incentive: `Que fixe, {nombre}! 🔥 Estamos mesmo contentes que tenhas curtido tanto {negocio}!

Fazes-nos o mega favor de deixar uma avaliação no {plataforma}? É só um minutinho!

👉 {url}

E da nossa parte, o teu presente: *{incentivo}* 🎁🙌

Quando publicares a avaliação, manda-nos um screenshot e nós enviamos já. És incrível! 💚`,

  screenshot_verified: `MUITO OBRIGADO, {nombre}! 🎉🔥 Vimos a tua avaliação no {plataforma} e estamos super felizes!

Como dissemos, aqui está o teu presente: *{incentivo}* 🎁

És incrível! Obrigado por apoiares {negocio} 💚✨`,

  screenshot_retry: `Ei {nombre}! 😊 Recebemos a tua foto mas as estrelas não estão muito nítidas.

Podes mandar-nos um screenshot mais clarinho com a avaliação? Assim que virmos enviamos o teu presente 🎁`,

  conversation_closing: `Muito obrigado pelo tempo, {nombre}! 😊 Foi mesmo fixe falar contigo. Se precisares de algo, contacta {negocio} diretamente. Cuida-te! 💚`,
};

// ---------------------------------------------------------------------------
// Exportación del mapa completo de plantillas por idioma y tono
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Twilio Content Template SIDs aprobados por Meta (business-initiated)
// ---------------------------------------------------------------------------

export const WHATSAPP_TEMPLATE_SIDS: Record<WhatsAppLanguage, {
  review_request: string;
  review_reminder: string;
  review_incentive: string;
}> = {
  es: {
    review_request:  "HX62d7875668bf5c8fb93aba6906903448",
    review_reminder: "HX7ea4e97d6deddc8767a290b92adf6a09",
    review_incentive:"HXb784e5ecce5fb44f06c667ef6142f468",
  },
  en: {
    review_request:  "HX2aff647ed8f587640223e0dfbfb772d6",
    review_reminder: "HXadc1fa2679fcde03fd963afd29371d74",
    review_incentive:"HXb2d479006ed3a4ac2330d733b11a3cd6",
  },
  fr: {
    review_request:  "HXcd142766f99fa7347f6fb373bc1a6eaf",
    review_reminder: "HXbfb4e1e9f183f5b14e093e3eb6fedc64",
    review_incentive:"HX054b4435ee8c7d559d63bafaede00728",
  },
  de: {
    review_request:  "HX19403156b9d8f975ca64e709ff3632e1",
    review_reminder: "HXb1f9990c79233bd0d2d391f8286ba670",
    review_incentive:"HXf5db3fc2c17ac153a2c3bf9488925365",
  },
  it: {
    review_request:  "HXb3c6951ed53ae59333d4f60916178d53",
    review_reminder: "HX950d43fddb04f5722c1180c3f8fea2c4",
    review_incentive:"HXf9bb8425def3362df89d6ad856fcc834",
  },
  pt: {
    review_request:  "HXa8ee35555bbe1b7c3c938bcb00874c5c",
    review_reminder: "HX679d4c3087c0baa09ebe0e95719ddec8",
    review_incentive:"HXbc1a6983c7e87e544a6706407baa37d7",
  },
};

export const MESSAGE_TEMPLATES: Record<WhatsAppLanguage, Record<BusinessTone, ToneTemplates>> = {
  es: { tuteo: TUTEO_ES, usted: USTED_ES, juvenil: JUVENIL_ES },
  en: { tuteo: TUTEO_EN, usted: USTED_EN, juvenil: JUVENIL_EN },
  fr: { tuteo: TUTEO_FR, usted: USTED_FR, juvenil: JUVENIL_FR },
  de: { tuteo: TUTEO_DE, usted: USTED_DE, juvenil: JUVENIL_DE },
  it: { tuteo: TUTEO_IT, usted: USTED_IT, juvenil: JUVENIL_IT },
  pt: { tuteo: TUTEO_PT, usted: USTED_PT, juvenil: JUVENIL_PT },
};

// ---------------------------------------------------------------------------
// Mensaje de bienvenida por defecto (editable en Configuración)
// ---------------------------------------------------------------------------

/** @deprecated Use DEFAULT_WELCOME_MESSAGES[language] instead */
export const DEFAULT_WELCOME_MESSAGE =
  "¡Hola {nombre}! Soy el equipo de {negocio}. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊 (Responde STOP si no deseas recibir más mensajes)";

// ---------------------------------------------------------------------------
// Plan configuration
// ---------------------------------------------------------------------------

/** Nombres válidos de plan de suscripción — única fuente de verdad */
export const PLAN_NAMES = ["free", "starter", "pro"] as const;
export type PlanName = (typeof PLAN_NAMES)[number];

/** Límite mensual de recordatorios WhatsApp por plan */
export const PLAN_MONTHLY_REMINDER_LIMITS: Record<PlanName, number> = {
  free:    5,
  starter: 50,
  pro:     250,
};

export const DEFAULT_WELCOME_MESSAGES: Record<WhatsAppLanguage, string> = {
  es: "¡Hola {nombre}! Soy el equipo de {negocio}. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊 (Responde STOP si no deseas recibir más mensajes)",
  en: "Hi {nombre}! We're the team at {negocio}. How was your experience with us today? Your feedback helps us improve 😊 (Reply STOP if you don't wish to receive further messages)",
  fr: "Bonjour {nombre} ! Nous sommes l'équipe de {negocio}. Comment s'est passée votre expérience avec nous aujourd'hui ? Votre avis nous aide à nous améliorer 😊 (Répondez STOP pour ne plus recevoir de messages)",
  de: "Hallo {nombre}! Wir sind das Team von {negocio}. Wie war Ihre Erfahrung mit uns heute? Ihr Feedback hilft uns, besser zu werden 😊 (Antworten Sie STOP, wenn Sie keine weiteren Nachrichten erhalten möchten)",
  it: "Ciao {nombre}! Siamo il team di {negocio}. Com'è stata la tua esperienza con noi oggi? La tua opinione ci aiuta a migliorare 😊 (Rispondi STOP se non desideri ricevere altri messaggi)",
  pt: "Olá {nombre}! Somos a equipa de {negocio}. Como foi a sua experiência connosco hoje? A sua opinião ajuda-nos a melhorar 😊 (Responda STOP se não desejar receber mais mensagens)",
};
