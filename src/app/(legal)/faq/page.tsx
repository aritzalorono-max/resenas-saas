import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Resuelve tus dudas sobre ReseñasYa: cómo funciona, qué plataformas soporta, si es legal y cómo personalizar los mensajes de WhatsApp.",
};

const faqs = [
  {
    q: "¿Cómo funciona exactamente?",
    a: "Introduces el nombre y teléfono de tu cliente en el panel. Le llega un WhatsApp personalizado preguntando por su experiencia. Claude AI analiza la respuesta al instante: si es positiva, le anima a dejar reseña con el enlace directo; si es negativa, responde con empatía sin enviarle al perfil público.",
  },
  {
    q: "¿Funciona para Google Maps, App Store y Play Store?",
    a: "Sí. Solo tienes que configurar el enlace de destino en tu perfil: puede ser tu ficha de Google Maps, tu app en la App Store o en Play Store, o cualquier otra plataforma como Trustpilot. ReseñasYa envía ese enlace a los clientes satisfechos.",
  },
  {
    q: "¿Se puede usar para conseguir reseñas en varias plataformas a la vez?",
    a: "Sí. Puedes configurar diferentes campañas o segmentar manualmente: enviar a unos clientes el enlace de Google Maps y a otros el de Trustpilot, por ejemplo. Algunos negocios alternan plataformas según el perfil del cliente.",
  },
  {
    q: "¿Cómo funcionan los incentivos y códigos de descuento?",
    a: "En el plan Negocio o Agencia puedes activar incentivos: el cliente recibe un mensaje invitándole a dejar una reseña de 5★ y enviar la captura de pantalla. La IA verifica automáticamente que la reseña tiene 5 estrellas y le responde con el código de descuento o recompensa al instante, sin intervención humana.",
  },
  {
    q: "¿Funciona para abogados, gestorías y psicólogos?",
    a: "Sí. Sectores con alta sensibilidad lo usan con el tono «usted» para mantener la formalidad. El filtro de sentimiento es especialmente valioso aquí: gestiona los casos delicados en privado, sin exposición pública.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Una cuenta de Twilio (WhatsApp Business Sandbox gratuita para empezar), el enlace de Google Maps, App Store, Play Store o Trustpilot de tu negocio, y registrarte en ReseñasYa. La configuración completa lleva menos de 5 minutos.",
  },
  {
    q: "¿Es legal enviar WhatsApps a clientes para pedir reseñas?",
    a: "Sí, siempre que el cliente haya dado su consentimiento para recibir comunicaciones. Recomendamos informarle durante la visita o en el proceso de compra, y contar con su número de teléfono facilitado voluntariamente. El envío cumple con el RGPD bajo base legitimadora de interés legítimo o consentimiento.",
  },
  {
    q: "¿Puedo personalizar los mensajes de WhatsApp?",
    a: "Sí. Puedes personalizar el mensaje inicial y elegir entre tres tonos: trato de tú (cercano), usted (formal) o juvenil (desenfadado). Los mensajes de seguimiento se adaptan automáticamente al tono elegido.",
  },
  {
    q: "¿Qué pasa si un cliente deja una valoración negativa?",
    a: "La IA detecta el sentimiento negativo y responde con un mensaje empático invitando al cliente a contar qué pasó, sin enviarle al perfil público de Google Maps ni a ninguna otra plataforma. Tú recibes el feedback en el panel para gestionarlo de forma interna.",
  },
  {
    q: "¿Cuántas solicitudes puedo enviar al mes?",
    a: "Depende del plan: Básico (5€/mes) incluye 10 solicitudes al mes, Negocio (15€/mes) incluye 100 solicitudes, y Agencia (30€/mes) incluye 500 solicitudes. Si necesitas más, contacta con nosotros.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí, sin permanencia ni penalización. Puedes cancelar desde tu panel de cuenta cuando quieras. El servicio seguirá activo hasta el final del periodo facturado.",
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
