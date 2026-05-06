import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — ReseñasYa",
  description:
    "Resuelve tus dudas sobre ReseñasYa: cómo funciona, qué plataformas soporta, si es legal y cómo personalizar los mensajes de WhatsApp.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    q: "¿Cómo funciona exactamente?",
    a: "Introduces el nombre y teléfono de tu cliente en el panel. Le llega un WhatsApp personalizado preguntando por su experiencia. La IA analiza la respuesta al instante: si es positiva, le anima a dejar reseña con el enlace directo a la plataforma que elijas; si es negativa, responde con empatía sin enviarle al perfil público.",
  },
  {
    q: "¿Para qué plataformas funciona?",
    a: "Para cualquiera: Google Maps, App Store, Play Store, Trustpilot o cualquier otra URL de reseñas. Solo tienes que configurar el enlace de destino en tu perfil y ReseñasYa lo envía automáticamente a los clientes satisfechos.",
  },
  {
    q: "¿Se puede usar para varias plataformas a la vez?",
    a: "Sí. Puedes configurar varias plataformas en tu perfil y elegir cuál está activa en cada momento, o alternarlas según el perfil del cliente. Algunos negocios envían a Google Maps de lunes a jueves y a Trustpilot el resto de la semana.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Solo registrarte en ReseñasYa y añadir el enlace de tu perfil de reseñas (Google Maps, App Store, etc.). La configuración completa lleva menos de 1 minuto.",
  },
  {
    q: "¿Cuántas solicitudes puedo enviar al mes?",
    a: "Depende del plan: Gratis incluye 5 WhatsApps al mes, Starter (9,9€/mes) incluye 50 contactos, y Pro (29,9€/mes) incluye 250 contactos. Puedes cambiar de plan o cancelar en cualquier momento desde la sección de Facturación.",
  },
  {
    q: "¿Cómo funcionan los incentivos y códigos de descuento?",
    a: "Disponible en el plan Pro. Puedes activar un incentivo: el cliente recibe un mensaje invitándole a dejar una reseña de 5★ y enviar la captura de pantalla. La IA verifica automáticamente que la reseña tiene 5 estrellas y le responde con el código de descuento o recompensa al instante, sin intervención humana.",
  },
  {
    q: "¿Puedo personalizar los mensajes de WhatsApp?",
    a: "Sí. Puedes personalizar el mensaje inicial con el nombre del cliente y el nombre de tu negocio, y elegir entre tres tonos de comunicación: trato de tú (cercano), usted (formal) o juvenil (desenfadado). Los mensajes de seguimiento se adaptan automáticamente al tono elegido.",
  },
  {
    q: "¿Qué pasa si un cliente deja una valoración negativa?",
    a: "La IA detecta el sentimiento negativo y responde con un mensaje empático invitando al cliente a contar qué pasó, sin enviarle a ningún perfil público. Tú recibes el feedback en el panel para gestionarlo de forma interna antes de que se convierta en una reseña negativa.",
  },
  {
    q: "¿Funciona para abogados, psicólogos y otros sectores sensibles?",
    a: "Sí. Sectores con alta sensibilidad lo usan con el tono «usted» para mantener la formalidad. El filtro de sentimiento es especialmente valioso aquí: gestiona los casos delicados en privado, sin exposición pública.",
  },
  {
    q: "¿Es legal enviar WhatsApps a clientes para pedir reseñas?",
    a: "Sí, siempre que el cliente haya dado su consentimiento para recibir comunicaciones. Recomendamos informarle durante la visita o en el proceso de compra, y contar con su número de teléfono facilitado voluntariamente. El envío cumple con el RGPD bajo base legitimadora de interés legítimo o consentimiento.",
  },
  {
    q: "¿Cómo gestiono mi suscripción o la cancelo?",
    a: "Desde la sección Facturación de tu panel puedes ver tu plan actual, cambiar a otro plan o cancelar tu suscripción en cualquier momento. La cancelación es efectiva al final del período facturado y no hay permanencia ni penalización.",
  },
  {
    q: "¿Los datos de mis clientes están seguros?",
    a: "Sí. Los datos se almacenan en Supabase con cifrado en tránsito (HTTPS/TLS) y Row Level Security activo: cada negocio solo accede a sus propios datos. Los datos de pago son gestionados íntegramente por Stripe y nunca se almacenan en nuestros servidores.",
  },
];

export default function FaqPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Preguntas frecuentes</h1>
        <p className="text-gray-500 text-lg">
          Todo lo que necesitas saber antes de empezar con ReseñasYa.
        </p>
      </div>

      <dl className="space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-200 transition-colors open:border-brand-200 open:bg-white open:shadow-sm"
          >
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none">
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</span>
              <ChevronDown className="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5">
              <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{faq.a}</p>
            </div>
          </details>
        ))}
      </dl>
    </>
  );
}
